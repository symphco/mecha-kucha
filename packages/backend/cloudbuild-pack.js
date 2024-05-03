const cloudbuildPack = require('../../utils/cloudbuild-pack');
const packageJson = require('./package.json');

const mainFile = {
  path: 'dist/cjs/production/index.js',
  dest: 'server.js',
  main: true,
};

void cloudbuildPack({
  assets: [
    mainFile,
    {
      path: 'app.yaml',
    },
    {
      path: '.env',
    }
  ],
  destDir: '.cloudbuild',
  packageJson,
  start: `node ${mainFile.dest}`,
});
