/*By Jason Chalom 2014, Entelect Software
Under the MIT License
This will take some test json data and convert to xlsx using desired styling and formatting
https://github.com/natergj/excel4node
*/
"use strict";
var xl_xp = require('../lib/data4node.js');
var util = require('util');
var helper = require('../lib/helpers.js');

var fs = require('fs');

var config = JSON.parse(fs.readFileSync("config.json"));

var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));



console.log("Starting Conversion....");
//var l = xl_xp.createExcelReports(reports, styleObj, config);
// for (var i = 0; i < 1000; i++)
//   console.log(helper.pseudoRandGen());
// var csvParser = require('../lib/parser/csv.js');
// var str = "Make;Model;Year\nFord;Fiesta Mk5 Reface;2003\nHonda;Civic;2013";
// var expectedData = [
//   [
//     "Make",
//     "Model",
//     "Year"
//   ],
//   [
//     "Ford",
//     "Fiesta Mk5 Reface",
//     "2003"
//   ],
//   [
//     "Honda",
//     "Civic",
//     "2013"
//   ]
// ];

//var obj = csvParser.parseToDataObj(str);
//var truth = helper.deepCompare(obj, expectedData);
//console.log("Test: " + util.inspect(obj) + "\ntruth: " + truth);
