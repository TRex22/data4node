var helper = require('../helpers.js');
var util = require('util')

var exposed = {
  jsonToHtmlList : jsonToHtmlList
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {

  };
}

function jsonToHtmlList(json) {
  return objToHtmlList(json);
}
//TODO REPAIR
function objToHtmlList(obj) {
  if (obj instanceof Array) {
    var ol = createHtmlElement('ol');
    for (var child in obj) {
      if (obj.hasOwnProperty(child)) {
        var li = createHtmlElement('li');
        li.appendChild(objToHtmlList(obj[child]));
        ol.appendChild(li);
      }
    }
    return ol;
  }
  else if (obj instanceof Object && !(obj instanceof String)) {
    var ul = createHtmlElement('ul');
    for (var child in obj) {
      if (obj.hasOwnProperty(child)) {
        var li = createHtmlElement('li');
        li.appendChild(""+(child + ": "));
        li.appendChild(objToHtmlList(obj[child]));
        ul.appendChild(li);
      }
    }
    return ul;
  }
  else {
    return obj;
  }
}

function createHtmlElement(elementTag, dataStr, classStr, id, specialTags){
  var construct = {};
  construct.openTag = '<'+elementTag+' class=\''+classStr+'\' id=\''+id+' '+specialTags+' >';
  construct.data = ''+dataStr;
  construct.closeTag = '<'+elementTag+'>';
  return construct;
}
