const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader']
      })
    }, {
      test: /_nm\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'less-loader']
      })
    }, {
      test: /^((?!(_nm)).)*\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          path.resolve(__dirname, 'css-module-content'),
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              importLoaders: 3,
              camelCase: true
            }
          },
          path.resolve(__dirname, 'css-module-fix'),
          'postcss-loader',
          'less-loader'
        ]
      })
    }]
  },
  devtool: config.devtool || false,
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.envVariables
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
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
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         resolve('node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        context: resolve('src/static'),
        from: '**/*',
        ignore: ['.*']
      },
      {
        from: resolve('node_modules/babel-polyfill/dist/polyfill.min.js')
      },
      {
        context: dllConfig.path,
        from: '*.dll.js',
      }
    ])
  ]
});

if (!config.devtool) {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      compress: false,
      sourceMap: false
    })
  );
}

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
  $('body').append(`<script src='/polyfill.min.js'></script>`);

  return $.html();
}

module.exports = webpackConfig;
