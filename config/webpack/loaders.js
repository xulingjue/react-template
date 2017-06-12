const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

/**
 * Generate default css loaders
 */
exports.cssLoaders = function (options) {
  options = options || {};
  let loaders = [];

  if (!options.extract) {
    loaders.push({
      loader: 'style-loader'
    });
  }
  loaders.push({
    loader: 'css-loader',
    options: {
      minimize: options.minimize,
      sourceMap: options.sourceMap,
      modules: options.cssModules,
      localIdentName: options.cssModules && '[name]__[local]--[hash:base64:5]',
      importLoaders: options.cssModules && options.importLoaders || 0
    }
  });
  if (options.cssModules) {
    loaders.push({ loader: path.resolve(__dirname, 'css-module-fix') });
  }
  loaders.push({
    loader: 'postcss-loader',
    options: {
      plugins: () => [require('autoprefixer')()]
    }
  });

  return loaders;
};

/**
 * Generate custom style loader
 * @param loader
 * @param options
 * @param defaultOptions Options for default loaders
 */
exports.generateCSSLoaders = function (loader, options, defaultOptions) {
  let loaders = exports.cssLoaders(defaultOptions);
  if (loader) {
    loaders.push({
      loader: loader + '-loader',
      options: options || {}
    });
  }

  // Extract CSS when that option is specified
  // (which is the case during production build)
  if (defaultOptions.extract) {
    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders
    });
  } else {
    return loaders;
  }
};

/**
 * Generate loaders for standalone style files
 * @param options
 */
exports.styleLoaders = function (options) {
  return [
    {
      test: /\.css$/,
      use: exports.generateCSSLoaders(null, {}, Object.assign({}, options, { cssModules: false }))
    },
    {
      test: /_nm\.less$/,
      use: exports.generateCSSLoaders('less', {}, Object.assign({}, options, { cssModules: false, importLoaders: 3 }))
    },
    {
      test: /^((?!(_nm)).)*\.less$/,
      use: exports.generateCSSLoaders('less', {}, Object.assign({}, options, { importLoaders: 3 }))
    }
  ];
};
