const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const config = require('../environments')['development'];
const dllConfig = require('./dll');

function resolve (dir) {
  return path.resolve(__dirname, '../../', dir);
}

// add hot-reload related code to entry chunks
baseWebpackConfig.entry = [
  'eventsource-polyfill',
  'webpack-hot-middleware/client?reload=true',
  // bundle the client for webpack-dev-server
  // and connect to the provided endpoint
  'webpack/hot/only-dev-server',
  // bundle the client for hot reloading
  // only- means to only hot reload for successful updates
].concat(baseWebpackConfig.entry);

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
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
    new webpack.WatchIgnorePlugin([
      /node_modules/
    ]),
    new FriendlyErrorsPlugin()
  ]
});

// add dlls manifest
webpackConfig.plugins = webpackConfig.plugins.concat(Object.keys(dllConfig.dlls).map(dllName => {
  return (
    new webpack.DllReferencePlugin({
      manifest: require(path.join(resolve(dllConfig.path), dllName + '.json'))
    })
  );
}));
webpackConfig.plugins.push(
  new HtmlWebpackIncludeAssetsPlugin({
    append: false,
    assets: [{
      path: '', glob: '*.dll.js', globPath: path.join(dllConfig.path, '/')
    }]
  })
);

module.exports = webpackConfig;

function templateContent () {
  const html = fs.readFileSync(resolve('src/index.html'), 'utf8');
  const $ = cheerio.load(html);
  $('body').append(`<script type="text/javascript" src='/polyfill.js'></script>`);

  return $.html();
}
