const cloudbuildPack = require('../../utils/cloudbuild-pack');
const packageJson = require('./package.json');

void cloudbuildPack({
  assets: [
    {
      path: 'dist/cjs/production/index.js',
      dest: 'server.js',
      main: true,
    },
    {
      path: 'app.yaml',
    },
    {
      path: '.env',
    }
  ],
  destDir: '.cloudbuild',
  packageJson,
});
