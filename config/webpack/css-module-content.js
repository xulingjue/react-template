module.exports = function (source) {
  this.cacheable && this.cacheable();
  var content = source.toString();
  if (/module\.exports\s*=\s*require\s*\(/.test(content)) {
    content = this.exec(source, this.resource).toString();
  }

  var localsReg = /exports\.locals\s=\s({[^}]+})/;
  var locals = localsReg.exec(source.toString());

  var ret = source.toString();
  if (locals) {
    locals = JSON.parse(locals[1]);
    locals.css_content = content;
    locals = 'exports.locals = ' + JSON.stringify(locals) + ';';
    ret = ret.replace(localsReg, locals);
  }
  return ret;
};
