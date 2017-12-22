const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

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

const buildDeps = getBuildDeps();

if (!existDepsJson || !existDll) {
  run(buildDeps);
} else if (existDepsJson) {
  let depsJson = fs.readFileSync(dllManifestDepsPath, 'utf8');
  try {
    depsJson = JSON.parse(depsJson);
  } catch (e) {
    depsJson = {};
  }

  let currentDeps = depsJson.dependencies || {};

  isChanged = depsJson.env !== buildEnv || isBuildDepsChange(buildDeps, currentDeps) ||
    isPackageChange(currentDeps);

  if (isChanged) {
    run(buildDeps);
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

/**
 * Get build dll dependencies
 */
function getBuildDeps () {
  const deps = {};
  const dependencies = pkg.dependencies || {};
  const devDependencies = pkg.devDependencies || {};

  Object.keys(dllConfig.dlls).forEach(dllName => {
    const dllDeps = dllConfig.dlls[dllName] || [];
    dllDeps.forEach(depName => {
      deps[depName] = dependencies[depName] || devDependencies[depName];
      if (!deps[depName]) {
        console.log(chalk.red(`package.json can not find ${depName}`));
        process.exit(1);
      }
    });
  });
  return deps;
}

/**
 * Added or removed build dll dependencies
 */
function isBuildDepsChange (buildDeps = {}, currentDeps = {}) {
  let isChanged = false;
  Object.keys(buildDeps).every(depName => {
    isChanged = !currentDeps[depName];
    return !isChanged;
  });
  return isChanged;
}

/**
 * Changed dependency version
 */
function isPackageChange (currentDeps = {}) {
  let isChanged = false;
  const dependencies = pkg.dependencies || {};

  Object.keys(currentDeps).every(depName => {
    isChanged = !dependencies[depName] || dependencies[depName] !== currentDeps[depName];
    return !isChanged;
  });

  return isChanged;
}
