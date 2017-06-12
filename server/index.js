/* eslint consistent-return:0 */
const express = require('express');
const path = require('path');
const opn = require('opn');
const proxyMiddleware = require('http-proxy-middleware');
const setup = require('./middlewares/frontendMiddleware');
const config = require('../config/environments')[process.env.NODE_ENV || 'development'];

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.port || 8080;
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.proxyTable || {};

const app = express();

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

console.log('> Starting dev server...');
// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: path.resolve(__dirname, '../dist'),
  publicPath: '/',
}, (err) => {
  if (err) {
    return console.log('> Server start failed.');
  }
  const uri = 'http://localhost:' + port;
  console.log('> Listening at ' + uri + '\n');
  if (autoOpenBrowser && config.nodeEnv !== 'testing') {
    opn(uri);
  }
});

// Start your app.
app.listen(port);
