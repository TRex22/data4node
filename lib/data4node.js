/* By Jason Chalom 2014, Entelect Software
 * Under the MIT License
 * This will take some test json data and convert to xlsx using desired styling and formatting
 * https://github.com/natergj/excel4node

 * to use a stream and not write to file, just use buildExcelDataFromJson and push where-ever its the base-64 string
 * always save as xlsx the other formats may not work correctly.

 * Styles must have headings
 * Styles all have arrays for each main object. This corresponds to specific worksheets
 * Sub-object arrays sometimes correspond to headings, or image number or cell locations.
 * cells have a ws prop which is the worksheet number, computer readable

 * custStyles are linked directly at the cell level

 * uses doxx documentation see: https://github.com/FGRibreau/doxx
*/

/*config*/
var config;
var debug = false;

/*requirements*/
var xl = require('excel4node');
var fs = require('fs');
var http = require('http');

var helper = require('./helpers.js');
var excel_export = require('./excel_export/excel_export.js');
var babelFish = require('./parser/babelFish.js'); //an opening for some evil
var majorTom = require('./exporter/majorTom.js');

helper.log("Excel converter has started.");

var exposed = {
  createExcelReports: createExcelReports,
  createExcelTimeTable: createExcelTimeTable,
  createCsvReport: createCsvReport,
  createScsvReport: createScsvReport,
  createHtmlListFromJson: createHtmlListFromJson,
  babelFish: babelFish
};
module.exports = exposed;

/**
 * Create an excel report using a json object for the report data and another json object for the styles data
 * @param      {Object}  reports this is the JSON data of reports
 * @param      {Object}  styles this is the JSON data of styles defined for the Excel Report (Not required)
 * @param      {Object}  configuration this is the configuration object if a custom one is defined. (Not required)
 * @return     a binary stream of the produced xlsx file
 */
function createExcelReports(reports, styles, configuration) {
  var file = excel_export.setConfig(reports, styles, configuration);
  return excel_export.makeExcelDocument(reports, styles, file);
}

/**
 * Create an excel timetable using a json object for the report data and another json object for the styles data
 * @param      {Object}  reports this is the JSON data of reports
 * @param      {Object}  styles this is the JSON data of styles defined for the Excel Report (Not required)
 * @param      {Object}  configuration this is the configuration object if a custom one is defined. (Not required)
 * @return     a binary stream of the produced xlsx file
 */
function createExcelTimeTable(times, styles, configuration) {
  var file = excel_export.setConfig(times, styles, configuration);
  return excel_export.makeExcelTimeTable(times, styles, file);
}

/**
 * Create an CSV (Comma-seperated Values) file using a json object for the data input
 * @param      {Object}  reports this is the JSON data of reports
 * @return     a string of the produced csv data
 */
function createCsvReport(data){
  return babelFish.parseToCsv(data);
}

/**
 * Create an SCSV (Semi-Colon seperated Values) file using a json object for the data input
 * @param      {Object}  reports this is the JSON data of reports
 * @return     a string of the produced scsv data
 */
function createScsvReport(data){
  return babelFish.parseToScsv(data);
}

/**
* Create an html file using a json object for the data input
* @param      {Object}  reports this is the JSON data of reports
* @return     a stream of the html data produced
*/
function createHtmlListFromJson(data){
  return majorTom.objToHtmlExport.jsonToHtmlList(data);
}
