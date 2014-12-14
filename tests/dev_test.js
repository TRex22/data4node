/*By Jason Chalom 2014, Entelect Software
Under the MIT License
This will take some test json data and convert to xlsx using desired styling and formatting
https://github.com/natergj/excel4node
*/
"use strict";
var xl_xp = require('../excel_export.js');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("config.json"));

var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));



console.log("Starting Conversion....");
var l = xl_xp.createReports(reports, styleObj, config);
