/**
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const dllConfig = require('./dll');
const envs = require('../environments');
const buildEnv = process.env.BUILD_ENV || 'production';
const config = envs[buildEnv] || envs['production'];

const webpackConfig = {
  mode: buildEnv === 'production' ? 'production' : 'development',
  entry: dllConfig.dlls,

  output: {
    filename: '[name].dll.js',
    path: dllConfig.path,
    library: '[name]',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.envVariables
    }),

    new ProgressBarPlugin({
      format: ' building dll [:bar]' + chalk.green.bold(':percent') + ' :msg :elapsed',
      clear: false
    }),

    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(dllConfig.path, '[name].json')
    })
  ]
};

if (buildEnv.indexOf('development') < 0) {
  webpackConfig.output.filename = '[name].[chunkhash].dll.js';
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      compress: false,
      sourceMap: false
    })
  );
}

module.exports = webpackConfig;
