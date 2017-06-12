const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const loaders = require('./loaders');
const config = require('../environments')['development'];

function resolve (dir) {
  return path.resolve(__dirname, '../../', dir);
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [
    'eventsource-polyfill',
    'react-hot-loader/patch',
    // activate HMR for React
    'webpack-hot-middleware/client?reload=true',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
  ].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: loaders.styleLoaders({
      sourceMap: config.cssSourceMap,
      cssModules: config.cssModules
    })
  },
  // cheap-module-eval-source-map is faster for development
  // devtool: '#cheap-module-eval-source-map',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.envVariables
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      templateContent: templateContent(),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
});

function templateContent() {
  const html = fs.readFileSync(resolve('src/index.html')).toString();

  const $ = cheerio.load(html);
  $('title').text('React Template');
  $('head').append(`<script src='/polyfill.js'></script>`);

  return $.html();
}