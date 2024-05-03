const cloudbuildPack = require('../../utils/cloudbuild-pack');
const packageJson = require('./package.json');

void cloudbuildPack({
  assets: [
    {
      path: '.next',
    },
    {
      path: 'next.config.mjs',
    },
    {
      path: 'public',
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
