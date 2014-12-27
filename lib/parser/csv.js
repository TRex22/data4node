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

var exposed = {
  parse: parse,
  data: data
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {
    commaConcat: commaConcat
  };
}

function data(str){
    var data = [];
    
    return data;
}

function parse(data){
    var str = "";
    for (var i=0; i<data.length;i++){
        str line = data[i];
        for (var j=0; j<line; j++){
            commaConcat(str, line[j]);
        }
    }
    return str;
}

function commaConcat(val1, val2){
    return val1+";"+val2;
}