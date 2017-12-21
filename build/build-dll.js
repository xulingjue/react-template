const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const pkg = require(path.join(__dirname, '..', 'package.json'));
const dllConfig = require('../config/webpack/dll');
const outputPath = dllConfig.path;
const dllManifestPath = path.join(outputPath, 'package.json');
const dllManifestDepsPath = path.join(outputPath, 'package-deps.json');
const buildEnv = process.env.BUILD_ENV || 'production';

console.log('Building dll...');

// Make sure the directory
shell.mkdir('-p', outputPath);

// Create a manifest so npm install doesn't warn us
if (!fs.existsSync(dllManifestPath)) {
  fs.writeFileSync(
      dllManifestPath,
      JSON.stringify({
          name: dllConfig.packageName,
          private: true,
          author: pkg.author,
          repository: '',
          version: pkg.version
      }),
      'utf8'
  );
}

const existDepsJson = fs.existsSync(dllManifestDepsPath);
const existDll = fs.existsSync(dllManifestPath);
const pkgDeps = pkg.dependencies || {};

if (!existDepsJson || !existDll) {
  run(pkgDeps);
} else if (existDepsJson) {
  let isChanged = false;
  let depsJson = fs.readFileSync(dllManifestDepsPath, 'utf8');
  try {
    depsJson = JSON.parse(depsJson);
  } catch (e) {
    depsJson = {};
  }
  let deps = depsJson.dependencies || {};

  if (depsJson.env !== buildEnv || !Object.keys(deps)) {
    isChanged = true;
  } else {
    Object.keys(deps).every(depName => {
      const depVersion = deps[depName];
      isChanged = !pkgDeps[depName] || depVersion !== pkgDeps[depName];
      return !isChanged;
    });
  }
  if (isChanged) {
    run(pkgDeps);
  }
}

console.log('Build dll successfully.');

/**
 * Run
 */
function run (deps) {
  if (buildEnv === 'production') {
    shell.exec('cross-env NODE_ENV=production BUILD_ENV=production webpack --display-chunks --color --config config/webpack/webpack.dll.conf.js');
  } else{
    shell.exec('cross-env NODE_ENV=development BUILD_ENV=development webpack --display-chunks --color --config config/webpack/webpack.dll.conf.js');
  }

  const depsJson = {
    env: buildEnv,
    dependencies: deps
  };

  fs.writeFileSync(dllManifestDepsPath, JSON.stringify(depsJson), 'utf8');
}
