const fs = require('fs/promises');
const path = require('path');
const child_process = require('child_process');
const packageJson = require('./package.json');

const ensure = (fn) => async (...args) => {
  try {
    if (fn === child_process.spawnSync) {
      console.log('$', args[0], ...args[1]);
    } else if (fn === fs.cp || fn === fs.rm || fn === fs.mkdir) {
      console.log('$', fn.name, ...args);
    } else {
      console.log(`!node: ${fn.name}`, ...args);
    }
    await fn(...args);
  } catch (err) {
    console.warn(err);
    // noop
  }
};

const DEST_DIR = '.cloudbuild';

const main = async (destDir) => {
  const mainFile = 'dist/cjs/production/index.js';
  const destPackageJson = path.join(DEST_DIR, 'package.json');
  const destFilename = 'server.js';
  await ensure(fs.mkdir)(destDir);
  await ensure(fs.cp)(mainFile, path.join(DEST_DIR, destFilename));
  await ensure(fs.rm)(destPackageJson)
  const workspaceDependencies = Object.entries(packageJson.dependencies)
    .filter(([, value]) => value.startsWith('workspace:'))
    .map(([key]) => key);

  await ensure(fs.writeFile)(destPackageJson, JSON.stringify({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description ?? '',
    main: destFilename,
    scripts: {
      start: `node ${destFilename}`,
    },
    dependencies: Object.fromEntries(
      [
        ...Object.entries(packageJson.dependencies)
          .filter(([key]) => !workspaceDependencies.includes(key)),
        ...Object.entries(packageJson.dependencies)
          .filter(([key]) => workspaceDependencies.includes(key))
          .map(([key]) => [key, `./${key.replace(/\//g, '__')}.tgz`]),
      ],
    ),
  }, null, 2));
  await ensure(fs.cp)('app.yaml', path.join(DEST_DIR, 'app.yaml'));
  await ensure(fs.cp)('.env', path.join(DEST_DIR, '.env'));
  await Promise.all(
    workspaceDependencies.map(async (d) => {
      const archiveName = `${d.replace(/\//g, '__')}.tgz`;
      await ensure(child_process.spawnSync)('tar', [
        '-czhf',
        archiveName,
        '-C',
        path.join('node_modules', d),
        '.',
      ]);
      await ensure(fs.cp)(archiveName, path.join(DEST_DIR, archiveName), { recursive: true })
      await ensure(fs.rm)(archiveName)
    }),
  );
  await ensure(fs.cp)('.env', path.join(DEST_DIR, '.env'));
}

void main(DEST_DIR);
