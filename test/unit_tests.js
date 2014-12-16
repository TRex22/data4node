/*By Jason Chalom 2014, Entelect Software
Under the MIT License

https://github.com/natergj/excel4node

Unit tests for library
*/
"use strict";
var tester = require("./test_lib.js");
var xl_xp = require('../lib/excel_export.js');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("tests/test_config.json"));

var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));

/*Test helpers*/
console.log("-----Testing helpers------");
var helper = require('../lib/helpers.js');

console.log("Test making a file.");
helper.makeAFile("file.test");

console.log("Test saving a file");
helper.saveFile("buffer", "output.test");

console.log("Test log");
helper.log("---Log Test---");

console.log("Test logObj");
var obj = {};
obj.name = 'test object';
obj.data = {};
obj.data.test1 = 'test1';
helper.logObj(obj);

console.log("Test logStyles");
var styleObj = {};
styleObj.ws = 0;
styleObj.col = 1;
styleObj.row = 1;
styleObj.style = "style1";
styelObj.type = "Number";
styleObj.numberFormat = "$#.00";
helper.logStyles(styleObj);

console.log("Test findArrObj");


console.log("Test findArrObjFromName");


console.log("Test findCell");


console.log("Test setDebug");
