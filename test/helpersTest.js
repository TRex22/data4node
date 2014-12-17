var should = require('chai').should();
//var assert = require("assert");

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');

var fn = require('./customtestFunctions.js');

/*js to test*/
var xl_xp = require('../lib/excel_export.js');
var helper = require('../lib/helpers.js');
var mrData = require('../lib/mrData.js');
var stylizer = require('../lib/stylizer.js');

var config = JSON.parse(fs.readFileSync("test/test_config.json"));
var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));

var arr = [];
var obj = {};
obj.name = "hello there";
var obj2 = {};
obj2.name = "AAAAAAAAAA!";
arr.push(obj2);
arr.push(obj);

describe('#helpers', function() {
  it('makeAFile', function() {
    helper.makeAFile("test/file.test");
    //returnFile("test/file.test").should.equal("");
  });

  it('saveAFile', function() {
    helper.saveFile("buffer", "test/output.test");
  });

  it('log', function() {
    helper.log("---Log Test---").should.equal("log: ---Log Test---");
  });

  it('logObj', function() {
    var obj = {};
    obj.name = 'test object';
    obj.data = {};
    obj.data.test1 = 'test1';
    helper.logObj(obj).should.equal("" + "obj: " + obj.name + " " + JSON.stringify(obj));
  });

  it('finds obj', function() {
    helper.findArrObj(arr, obj).should.equal(obj);
  });

  it('finds obj from name', function() {
    helper.findArrObjFromName(arr, obj.name).should.equal(obj);
  });

  it('findCell', function() {
    var cells = [];
    var cell = {};

    var ws = 0,
    col = 1,
    row = 1;

    cell.ws = ws;
    cell.row = row;
    cell.col = col;

    cells.push(cell);
    helper.findCell(cells, ws, col, row).should.equal(cell);
  });

  it('findCell not found return null', function() {
    var cells = [];
    var cell = {};

    var ws = 0,
    col = 1,
    row = 1;

    cell.ws = ws;
    cell.row = row;
    cell.col = col;

    cells.push(cell);
    should.not.exist(helper.findCell(cells, 0, 2, 2));
  });

  it('getDebug should be false', function() {
    helper.setDebug(false);
    helper.getDebug().should.equal(false);
  });

  it('setDebug and then check with getDebug should be true', function() {
    helper.setDebug(true);
    helper.getDebug().should.equal(true);
  });

  //quickCompare: quickCompare,
  //deepCompare: deepCompare,
  //removeLineFromFile: removeLineFromFile,
  //removeLineFromFile: removeLineFromFile,
  //appendFile: appendFile
  //logObj
  //dumpObjToFile(obj, outputFile)

});
