const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const loaders = require('./loaders');
const config = require('../environments')['production'];
const baseWebpackConfig = require('./webpack.base.conf');

function resolve (dir) {
  return path.resolve(__dirname, '../../', dir);
}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: loaders.styleLoaders({
      sourceMap: false,
      cssModules: config.cssModules,
      extract: true
    })
  },
  devtool: false,
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.envVariables
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      templateContent: templateContent(),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            resolve('node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        context: resolve('src/static'),
        from: '**/*',
        ignore: ['.*']
      },
      {
        from: resolve('node_modules/babel-polyfill/dist/polyfill.min.js')
      }
    ])
  ]
});

if (config.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

function templateContent() {
  const html = fs.readFileSync(resolve('src/index.html')).toString();

  const $ = cheerio.load(html);
  $('title').text('React Template');
  $('head').append(`<script src='/polyfill.min.js'></script>`);

  return $.html();
}

module.exports = webpackConfig;
