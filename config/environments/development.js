module.exports = {
  envVariables: {
    NODE_ENV: '"development"',
    BUILD_ENV: '"development"'
  },
  port: 8080,
  autoOpenBrowser: false,
  // https://github.com/chimurai/http-proxy-middleware
  proxyTable: {},
  // CSS Sourcemaps off by default because relative paths are "buggy"
  // with this option, according to the CSS-Loader README
  // (https://github.com/webpack/css-loader#sourcemaps)
  // In our experience, they generally work as expected,
  // just be aware of this issue when enabling this option.
  cssSourceMap: false
};
