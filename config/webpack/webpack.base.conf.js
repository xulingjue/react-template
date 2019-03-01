const path = require('path');
const chalk = require('chalk');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const config = require('../environments')[process.env.BUILD_ENV || 'development'];

function resolve (dir) {
  return path.resolve(__dirname, '../../', dir);
}

const NODE_ENV = process.env.NODE_ENV;
const isEnvDevelopment = NODE_ENV === 'development';
const isEnvProduction = NODE_ENV === 'production';

// style files regexes
const cssRegex = /.\.css$/;
const cssModuleRegex = /.\.module\.css$/;
const lessRegex = /.\.less$/;
const lessModuleRegex = /.\.module\.less$/;

// Get style loaders
// "postcss" loader applies autoprefixer to our CSS
// "css" loader resolve paths in CSS and adds assets as dependencies
// "style" loader turns CSS into JS modules that inject <style> tags
const getStyleLoaders = (cssOptions, preProcessors) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: config.cssSourceMap
      }
    }
  ].filter(Boolean);
  if (preProcessors) {
    if (!Array.isArray(preProcessors)) {
      preProcessors = [preProcessors];
    }
    preProcessors.forEach(processor => {
      if (typeof preProcessors === 'string') {
        loaders.push({ loader: processor });
      } else if (Array.isArray(preProcessors)) {
        loaders.push({ loader: processor[0], options: processor[1] });
      }
    });
  }
  return loaders;
};

module.exports = {
  entry: [resolve('src/index.js')],
  output: {
    path: resolve(config.outputPath),
    filename: '[name].js',
    publicPath: config.publicPath
  },
  resolve: {
    modules: [resolve('src'), resolve('node_modules')],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'src': resolve('src')
    },
    symlinks: false
  },
  module: {
    // Makes missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: resolve('src'),
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: resolve('src'),
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: config.cssSourceMap
        })
      },
      // Add support for CSS Modules
      // using the extension .module.css
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: config.cssSourceMap,
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
          camelCase: true
        })
      },
      // Less support
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders({
          importLoaders: 2,
          sourceMap: config.cssSourceMap
        }, [
          [require.resolve('less-loader'), { options: { javascriptEnabled: true } }]
        ])
      },
      {
        test: lessModuleRegex,
        use: getStyleLoaders({
          importLoaders: 2,
          sourceMap: config.cssSourceMap,
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
          camelCase: true
        }, [
          [require.resolve('less-loader'), { options: { javascriptEnabled: true } }]
        ])
      }
    ]
  },
  target: 'web',
  plugins: [
    new ProgressBarPlugin({
      format: ' building [:bar]' + chalk.green.bold(':percent') + ' :msg :elapsed',
      clear: false
    })
  ]
};
