/*By Jason Chalom 2014, Entelect Software
  Under the MIT License
  This will take some test json data and convert to xlsx using desired styling and formatting
  https://github.com/natergj/excel4node

  to use a stream and not write to file, just use buildExcelDataFromJson and push where-ever its the base-64 string
  always save as xlsx the other formats may not work correctly.

  Styles must have headings
  Styles all have arrays for each main object. This corresponds to specific worksheets
  Sub-object arrays sometimes correspond to headings, or image number or cell locations.
  cells have a ws prop which is the worksheet number, computer readable

  custStyles are linked directly at the cell level
*/

//requirements
var xl = require('excel4node');
var fs = require('fs');
var http = require('http');
var debugg = require('debug')('xcl');

var helper = require('./helpers.js');
var mrData = require('./mrData.js');
var stylizer = require('./stylizer.js');

helper.log("Excel converter has started.");

/*config*/
var config;
var debug = false;

var exposed = {
  createReports: createReports
};
module.exports = exposed;

function createReports(reports, styles, configuration) {
  var file = setConfig(reports, styles, configuration);
  return makeExcelDocument(reports, styles, file);
}

function setConfig(reports, styles, configuration) {
  if (configuration) {
    config = configuration;
    debug = config.debug;
  } else {
    config = JSON.parse(fs.readFileSync("excel_export/config.json"));
    debug = config.debug;
  }

  helper.setDebug(debug);

  /*Test Data*/
  if (config.testData) {
    reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
    styles = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));
  }

  if (config.fileWriter) {
    /*Save directory for files*/
    return config.dir + config.filename;
  }

  return null;
}

function makeExcelDocument(reports, styleObj, file) {
  var wb = new xl.WorkBook();
  wb.debug = config.internalWbLibDebug;
  // print headings first

  var cells = {};
  cells.heading = [];
  cells.data = [];

  var worksheets = mrData.getWorksheets(wb, reports, styleObj, cells);

  helper.log("------------Raw Data Done------------");

  // run stylizer
  if (styleObj) {
    stylizer.shazam(reports, styleObj, wb, worksheets, cells);
  } else {
    helper.log("Styles Object is Empty."); //TODO JMC add try-catches
  }

  if (config.fileWriter) {
    wb.write(file);
    console.log("file written.");
    return null;
  }

  helper.log("------------Response------------\n" + wb);
  return wb;
}
