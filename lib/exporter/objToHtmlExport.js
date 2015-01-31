var helper = require('../helpers.js');

var exposed = {
  jsonToHtmlList : jsonToHtmlList
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {

  };
}

//from stackoverflow somewhere

function jsonToHtmlList(json) {
  return objToHtmlList(JSON.parse(json));
}

function objToHtmlList(obj) {
  if (obj instanceof Array) {
    var ol = document.createElement('ol');
    for (var child in obj) {
      if (obj.hasOwnProperty(child)) {
        var li = document.createElement('li');
        li.appendChild(objToHtmlList(obj[child]));
        ol.appendChild(li);
      }
    }
    return ol;
  }
  else if (obj instanceof Object && !(obj instanceof String)) {
    var ul = document.createElement('ul');
    for (var child in obj) {
      if (obj.hasOwnProperty(child)) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(child + ": "));
        li.appendChild(objToHtmlList(obj[child]));
        ul.appendChild(li);
      }
    }
    return ul;
  }
  else {
    return document.createTextNode(obj);
  }
}
