// https://github.com/webpack-contrib/css-loader/issues/74
module.exports = function (content) {
  return content.replace(/url\(('|")*(\.\/)*(.+?)('|")*\)/g, 'url(./$3)').replace(/\.\/((https?|ftp):\/\/)/, '$1');
};
