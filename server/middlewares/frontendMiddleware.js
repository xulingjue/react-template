/* eslint-disable global-require */
const express = require('express');
const path = require('path');
const compression = require('compression');
const dllConfig = require('../../config/webpack/dll');

function resolve (dir) {
  return path.join(__dirname, '../../', dir);
}

/**
 * Apply development middlewares
 * @param app
 * @param webpackConfig
 */
const addDevMiddlewares = (app, webpackConfig, next) => {
  const webpack = require('webpack');
  const compiler = webpack(webpackConfig);

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    // quiet: true
    noInfo: true,
    stats: 'errors-only'
  });

  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
  });

  app.use(compression());
  app.use(devMiddleware);
  app.use(hotMiddleware);

  app.get(/polyfill\.js/, (req, res) => {
    const filename = req.path.replace(/^\//, '');
    res.sendFile(path.resolve(__dirname, '../../node_modules/@babel/polyfill/dist', filename));
  });

  app.get(/\.dll\.js$/, (req, res) => {
    const filename = req.path.replace(/^\//, '');
    res.sendFile(path.join(dllConfig.path, filename));
  });

  app.use('/', express.static(resolve('src/static')));

  devMiddleware.waitUntilValid(() => next());
};

/**
 * Apply production middlewares
 * @param app
 * @param options
 */
const addProdMiddlewares = (app, options, next) => {
  const outputPath = options.outputPath || resolve('dist');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(express.static(outputPath));

  next();
};

/**
 * Front-end middleware
 */
module.exports = (app, options, next) => {
  if (process.env.NODE_ENV === 'development') {
    const webpackConfig = require('../../config/webpack/webpack.dev.conf');
    addDevMiddlewares(app, webpackConfig, next);
  } else {
    addProdMiddlewares(app, options, next);
  }
  return app;
};
