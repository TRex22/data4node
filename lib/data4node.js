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
//var debugg = require('debug')('xcl');

var helper = require('./helpers.js');
var excel_export = require('./excel_export/excel_export.js');
var babelFish = require('./parser/babelFish.js');

helper.log("Excel converter has started.");

/*config*/
var config;
var debug = false;

var exposed = {
  createExcelReports: createExcelReports,
  createExcelTimeTable: createExcelTimeTable,
  createCsvReport: createCsvReport
};
module.exports = exposed;

function createExcelReports(reports, styles, configuration) {
  var file = excel_export.setConfig(reports, styles, configuration);
  return excel_export.makeExcelDocument(reports, styles, file);
}

function createExcelTimeTable(times, styles, configuration) {
  var file = excel_export.setConfig(times, styles, configuration);
  return excel_export.makeExcelTimeTable(times, styles, file);
}

function createCsvReport(data){
  return babelFish.parseToCsv(data);
}
