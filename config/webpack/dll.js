/**
 * Config for Webpack DLL Plugin
 */
const path = require('path');

function resolve (dir) {
  return path.resolve(__dirname, '../../', dir);
}

module.exports = {
  // The DLL manifest:
  // [fileName]: [deps]
  dlls: {
    react: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-dom',
      'prop-types'
    ]
  },

  // We will generate dlls to node_modules/${packageName}
  packageName: 'dlls',

  // The path where the DLL manifest and bundle will get built
  path: resolve('node_modules/dlls')
};
