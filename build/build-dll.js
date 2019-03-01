const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const rm = require('rimraf');

const pkg = require(path.join(__dirname, '..', 'package.json'));
const dllConfig = require('../config/webpack/dll');
const webpackConfig = require('../config/webpack/webpack.dll.conf');
const outputPath = dllConfig.path;
const dllManifestPath = path.join(outputPath, 'package.json');
const dllManifestDepsPath = path.join(outputPath, 'package-deps.json');
const buildEnv = process.env.BUILD_ENV || 'production';

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

  let currentDlls = depsJson.dlls || {};
  let currentDeps = depsJson.dependencies || {};

  isChanged = depsJson.env !== buildEnv || isBuildKeysChange(dllConfig.dlls, currentDlls) ||
    isBuildDepsChange(buildDeps, currentDeps) ||
    isPackageChange(currentDeps);

  if (isChanged) {
    run(buildDeps);
  }
}

/**
 * Run
 */
function run (deps) {
  console.log('Building dll...');
  rm(path.join(outputPath), err => {
    if (err) throw err;
    webpack(webpackConfig, function (err, stats) {
      if (err) throw err;
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n');

      console.log(chalk.cyan('Build dll complete.\n'));

      const depsJson = {
        env: buildEnv,
        dlls: dllConfig.dlls,
        dependencies: deps
      };

      fs.writeFileSync(dllManifestDepsPath, JSON.stringify(depsJson), 'utf8');
    });
  });
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
      if (depName.indexOf('/') >= 0) {
        const name = depName.split('/')[0];
        deps[depName] = dependencies[name] || devDependencies[name]
          || dependencies[depName] || devDependencies[depName];
      } else {
        deps[depName] = dependencies[depName] || devDependencies[depName];
      }
      if (!deps[depName]) {
        console.log(chalk.red(`package.json can not find ${depName}`));
        process.exit(1);
      }
    });
  });
  return deps;
}

/**
 * Change the keys
 */
function isBuildKeysChange (dlls = {}, currentDlls = {}) {
  if (Object.keys(dlls).length !== Object.keys(currentDlls).length) return true;
  let isChange = false;
  Object.keys(dlls).every(key => {
    if (!currentDlls[key]) {
      isChange = true;
      return false;
    }
    return true;
  });
  return isChange;
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
