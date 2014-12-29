/*By Jason Chalom 2014, Entelect Software
Under the MIT License

This handles the csv data parsing

data arr
each list arr is a line
with each object in the list being a column

val1;val.2;val3;"str val"
row2;row2;row2
*/
var helper = require('../helpers.js');
var util = require('util');

var exposed = {
  parseToScsv: parseToScsv,
  parseToDataObj: parseToDataObj
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {};
}

function parseToDataObj(str) {
  var data = [];
  var lines = helper.strSplitLines(str);
  for (var i = 0; i < lines.length; i++) {
    var line = helper.strSemiColonSplitNoLine(lines[i]);
    data.push(line);
  }
  return data;
}

function parseToScsv(data, useHeader) {
  var str = "";
  if(useHeader){//if useHeader is true then the inital line is taken from properties name
    data.getOwnPropertyNames(obj).forEach(function(prop, idx, array) {
      if(prop !== "length")
        str = helper.semiColonConcat(str, prop);
    });
  }
  for (var i = 0; i < data.length; i++) {
    var line = data[i];
    for (var j = 0; j < line.length; j++) {
      if (j === 0)
        str = str + line[j];
      else if (j < line.length)
        str = helper.semiColonConcat(str, line[j]);
      else
        str = helper.concat(str, line[j]);
    }
    if (i !== data.length - 1)
      str = str + "\n";
  }
  return str;
}
