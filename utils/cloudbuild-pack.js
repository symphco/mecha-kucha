const fs = require('fs/promises');
const path = require('path');
const child_process = require('child_process');

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
  }
};

const getDestPath = (asset) => asset.dest ?? asset.path;
const getStartScript = (config) => config.packageJson?.scripts?.start ?? config.assets.reduce(
  (start, asset) => {
    if (asset.main) {
      return `node ${getDestPath(asset)}`;
    }

    return start;
  },
  undefined,
);

const getMainFile = (config) => config.assets.reduce(
  (start, asset) => {
    if (asset.main) {
      return getDestPath(asset);
    }

    return start;
  },
  undefined,
);

const getWorkspaceDependencies = (config) => (
  Object.entries(config.packageJson?.dependencies)
    .filter(([, value]) => value.startsWith('workspace:'))
    .map(([key]) => key)
);

const compressWorkspaceDependencies = async (config, workspaceDependencies) => {
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
      await ensure(fs.cp)(archiveName, path.join(config.destDir, archiveName), { recursive: true })
      await ensure(fs.rm)(archiveName)
    }),
  );
}

const getPackageJsonContents = (config, workspaceDependencies) => {
  const mainFile = getMainFile(config)
  const startScript = getStartScript(config);

  if (typeof startScript === 'undefined') {
    console.error('Could not produce start script');
    process.exit(1);
    return;
  }

  const newPackageJson = {
    name: config.packageJson?.name,
    version: config.packageJson?.version,
    description: config.packageJson?.description ?? '',
    dependencies: Object.fromEntries(
      [
        ...Object.entries(config.packageJson.dependencies)
          .filter(([key]) => !workspaceDependencies.includes(key)),
        ...Object.entries(config.packageJson.dependencies)
          .filter(([key]) => workspaceDependencies.includes(key))
          .map(([key]) => [key, `./${key.replace(/\//g, '__')}.tgz`]),
      ],
    ),
    scripts: {
      start: startScript,
    },
  }

  if (typeof mainFile !== 'undefined') {
    newPackageJson.main = mainFile;
  }

  return newPackageJson;
}

const copyAssets = async (config) => {
  await config.assets.reduce(
    async (lastPromise, asset) => {
      await lastPromise;

      await ensure(fs.cp)(asset.path, path.join(config.destDir, getDestPath(asset)), { recursive: true });
    },
    Promise.resolve(),
  );
};

const manageDependencies = async (config) => {
  const destPackageJson = path.join(config.destDir, 'package.json');
  const workspaceDependencies = getWorkspaceDependencies(config);
  const newPackageJson = getPackageJsonContents(config, workspaceDependencies);
  await ensure(fs.rm)(destPackageJson);
  await ensure(fs.writeFile)(destPackageJson, JSON.stringify(newPackageJson, null, 2));
  await compressWorkspaceDependencies(config, workspaceDependencies);
};

module.exports = async (config) => {
  await ensure(fs.mkdir)(config.destDir);
  await copyAssets(config);
  await manageDependencies(config);
};
