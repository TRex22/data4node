/*By Jason Chalom 2014, Entelect Software
  Under the MIT License

  This handles the ws data input from cells obj
*/
var helper = require('../helpers.js');

var exposed = {
  getWorksheets: getWorksheets
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {
    getHeadings: getHeadings,
    getData: getData
  };
}

function getWorksheets(wb, reports, styleObj, cells) {
  //check if null
  var worksheets = [];
  if (!reports)
    return worksheets; //TODO JMC Error reporting

  for (var i = 0; i < reports.length; i++) {
    var ws = wb.WorkSheet(reports[i].name);
    helper.log(reports[i].name);

    getHeadings(ws, reports, styleObj, cells, i);
    var data = getData(ws, worksheets, reports, cells, i);
    //helper.logObj(data);
    worksheets.push(ws);
  }
  return worksheets;
}

function getHeadings(ws, reports, styleObj, cells, i) {
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
      ws.Cell(1, col).String("" + prop); //fix for r c going from 1,1
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
      ws.Cell(1, col).String("" + p[prop]); //fix for r c going from 1,1
      cells.heading.push({
        "ws": i,
        "col": col,
        "row": 1,
        "value": p[prop]
      });
      k++;
    }
  }
}

function getData(ws, worksheets, reports, cells, i) {
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
        ws.Cell(row, col).String("" + p[prop]);
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
  else
    ws.Cell(2, 1).String("no data.");
}
