const merge = require('webpack-merge');

// Common config
const config = {
  // The directory's contents will be copied to output path directly.
  staticDirectory: 'static',
  outputPath: 'dist',
  publicPath: '/',
  // CSS Modules
  cssModules: true
};

module.exports = {
  'base': config,
  'development': merge(config, require('./development')),
  'production': merge(config, require('./production')),
  'testing': merge(config, require('./testing')),
  'env': () => {
    return {
      'NODE_ENV': process.env.NODE_ENV,
      'BUILD_ENV': process.env.BUILD_ENV
    };
  }
};
