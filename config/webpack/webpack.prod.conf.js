const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const envs = require('../environments');
const buildEnv = process.env.BUILD_ENV || 'production';
const config = envs[buildEnv] || envs['production'];
const dllConfig = require('./dll');

function resolve (dir) {
  return path.resolve(__dirname, '../../', dir);
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.envVariables
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: '[id].[contenthash:8].css'
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
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        context: resolve('src/static'),
        from: '**/*',
        ignore: ['.*']
      },
      {
        from: resolve('node_modules/@babel/polyfill/dist/polyfill.min.js')
      },
      {
        context: dllConfig.path,
        from: '*.dll.js',
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
      hidePathInfo: true,
      cacheGroups: {
        styles: {
          name: 'common',
          test: /\.(less|css)$/,
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
        }
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: !!config.devtool,
        terserOptions: {
          compress: {
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            comments: false,
            ascii_only: true
          }
        }
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true,
          discardDuplicates: true
        }
      })
    ]
  },
  devtool: config.devtool || false
});

// DLL reference
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

if (config.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

function templateContent () {
  const html = fs.readFileSync(resolve('src/index.html'), 'utf8');
  const $ = cheerio.load(html);
  $('body').append(`<script type="text/javascript" src='/polyfill.min.js'></script>`);

  return $.html();
}

module.exports = webpackConfig;
