const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

/**
 * Generate css rules
 */
exports.cssLoaders = function (options) {
  options = options || {};
  let defaultLoaders = [];

  defaultLoaders.push({ loader: 'style-loader' });
  defaultLoaders.push({
    loader: 'css-loader',
    options: {
      minimize: options.minimize,
      sourceMap: options.sourceMap,
      modules: options.cssModules,
      localIdentName: options.cssModules && '[name]__[local]--[hash:base64:5]'
    }
  });
  if (options.cssModules) {
    defaultLoaders.push({ loader: path.resolve(__dirname, 'css-module-fix') });
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    let loaders = defaultLoaders;
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: loaderOptions || {}
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders
      });
    } else {
      return loaders;
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    // sass: generateLoaders('sass', { indentedSyntax: true }),
    // scss: generateLoaders('sass'),
    // stylus: generateLoaders('stylus'),
    // styl: generateLoaders('stylus')
  }
};

// Generate loaders for standalone style files

exports.styleLoaders = function (options) {
  let output = [];
  let loaders = exports.cssLoaders(options);
  for (let extension in loaders) {
    let loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};
