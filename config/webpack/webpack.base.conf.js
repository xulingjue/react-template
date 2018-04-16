const path = require('path');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const autoprefixer = require('autoprefixer');
const config = require('../environments')['base'];

function resolve (dir) {
  return path.resolve(__dirname, '../../', dir);
}

module.exports = {
  entry: {
    main: [resolve('src/main.js')]
  },
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
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
