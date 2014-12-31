/*
By Jason Chalom 2014
Under the MIT License

This handles the data collection for pretty much everything, uses parsers as well.
This is the correct handle for using parsers although they are public so that one may use it to their own means
*/
var helper = require('../helpers.js');
var mrData = require('../mrData/mrData.js');

var exposed = {
  get: get
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {
    getHeadings: getHeadings,
    getData: getData
  };
}

function get(reports, i, styleObj, cells){
  cells = getHeadings(reports, i, styleObj, cells);
  cells = getData(data, i, cells);
  return cells;
}

function getHeadings(reports, i, styleObj, cells) { //styleobj is optional
  var useStyleHeadingsText = false;
  var p;

  if (styleObj.data.headingStyles[i]) {
    useStyleHeadingsText = styleObj.data.headingStyles[i].useStyleHeadingsText;
    p = styleObj.data.headingsText[i];
  }

  var prop;
  var k = 0;

  //do headings override from styles json
  if (!p || useStyleHeadingsText === false) {
    //take heading names from reports property names
    p = reports[i].data[0]; //only need the first data point
    for (prop in p) {
      var col;
      if (i === 0) { //j+2 to leave space for headings
        col = i + k + 1;
      } else {
        col = i + k;
      }
      cells.heading.push({
        "ws": i,
        "col": col,
        "row": 1,
        "value": prop
      });
      k++;
    }
  } else {
    for (prop in p) {
      helper.log(prop + " : " + p[prop]);
      var col;
      if (i === 0) { //j+2 to leave space for headings
        col = i + k + 1;
      } else {
        col = i + k;
      }
      cells.heading.push({
        "ws": i,
        "col": col,
        "row": 1,
        "value": p[prop]
      });
      k++;
    }
  }
  return cells;
}

function getData(data, i, cells) {
  if (reports[i].data.length > 0) {
    //insert data will be string for now. The typecasting will happen in styling
    for (var j = 0; j < reports[i].data.length; j++) {
      var p = reports[i].data[j];
      var prop; //property in p
      var k = 0;
      for (prop in p) {
        helper.log(prop + " : " + p[prop]);
        var row = j + 2;
        var col;
        if (i === 0) { //j+2 to leave space for headings
          col = i + k + 1;
        } else {
          col = i + k;
        }
        cells.data.push({
          "ws": i,
          "col": col,
          "row": row,
          "value": p[prop]
        });
        k++;
      }
    }
  }
  return cells;
}
