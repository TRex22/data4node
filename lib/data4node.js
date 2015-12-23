/**
*  By Jason Chalom 2014, Entelect Software
*  Under the MIT License
*
*  This is the main entry point for data4node.
*
*  This will take some test json data and convert to xlsx using desired styling and formatting
*  https://github.com/natergj/excel4node
*
*  to use a stream and not write to file, just use buildExcelDataFromJson and push where-ever its the base-64 string
*  always save as xlsx the other formats may not work correctly.
*
*  Styles must have headings
*  Styles all have arrays for each main object. This corresponds to specific worksheets
*  Sub-object arrays sometimes correspond to headings, or image number or cell locations.
*  cells have a ws prop which is the worksheet number, computer readable
*
*  custStyles are linked directly at the cell level
s*/

//requirements
var xl = require('excel4node');
var fs = require('fs');
var http = require('http');
//var debugg = require('debug')('xcl');

var helper = require('./helpers.js');
var excel_export = require('./excel_export/excel_export.js');
var babelFish = require('./parser/babelFish.js'); //an opening for some evil

helper.log("Excel converter has started.");

/*config*/
var config;
var debug = false;

var exposed = {
  createExcelReports: createExcelReports,
  createExcelTimeTable: createExcelTimeTable,
  createCsvReport: createCsvReport,
  createScsvReport: createScsvReport,
  babelFish: babelFish
};
module.exports = exposed;

/**
 * Generate an Excel report using specified settings and json file
 * @param      {Object}   reports or json object with data
 * @param      {Object}   styles configuration
 * @param      {Object}   configuration file
 * @jsFiddle   A jsFiddle embed URL
 */
function createExcelReports(reports, styles, configuration) {
  var file = excel_export.setConfig(reports, styles, configuration);
  return excel_export.makeExcelDocument(reports, styles, file);
}

/**
 * Generate an Excel timetable using specified settings and json file
 * @param      {Object}   times or json object with data
 * @param      {Object}   styles configuration
 * @param      {Object}   configuration file
 * @jsFiddle   A jsFiddle embed URL
 */
function createExcelTimeTable(times, styles, configuration) {
  var file = excel_export.setConfig(times, styles, configuration);
  return excel_export.makeExcelTimeTable(times, styles, file);
}

/**
 * Generate an csv output stream from json data
 * @param      {Object}   json object with data
 * @jsFiddle   A jsFiddle embed URL
 */
function createCsvReport(data){
  return babelFish.parseToCsv(data);
}

/**
 * Generate an scsv output stream from json data
 * @param      {Object}   json object with data
 * @jsFiddle   A jsFiddle embed URL
 */
function createScsvReport(data){
  return babelFish.parseToScsv(data);
}
