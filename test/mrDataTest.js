var should = require('chai').should();
//var assert = require("assert");

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');

var fn = require('./customTestFunctions.js');

/*js to test*/
var xl_xp = require('../lib/excel_export.js');
var helper = require('../lib/helpers.js');
var mrData = require('../lib/mrData.js');
var stylizer = require('../lib/stylizer.js');

var config = JSON.parse(fs.readFileSync("test/test_config.json"));
var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));

describe('#mrData', function() {
  // _private.getHeadings:
  // _private.getData:
  it('getHeadings should return headings in cells that conform to styleObj nice headings', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done

    var wb = new xl.WorkBook();
    var ws = wb.WorkSheet("Test Workbook");
    var i = 0;
    var cells = {};
    cells.heading = [];
    cells.data = [];
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;

    var data = [{
      "name": "monthlySummary",
      "data": [{
        "employeeNumber": "x1y2",
        "surname": "Sean",
        "firstName": "None",
        "totalAchievements": 3,
        "totalKudos": 10
      }]
    }];

    var expectedCells = {
      "heading": [{
        "ws": 0,
        "col": 1,
        "row": 1,
        "value": "Employee Number"
      }, {
        "ws": 0,
        "col": 2,
        "row": 1,
        "value": "Surname"
      }, {
        "ws": 0,
        "col": 3,
        "row": 1,
        "value": "First Name"
      }, {
        "ws": 0,
        "col": 4,
        "row": 1,
        "value": "Total Achievements"
      }, {
        "ws": 0,
        "col": 5,
        "row": 1,
        "value": "Total Kudos"
      }],
      "data": []
    };

    mrData._private.getHeadings(ws, data, styleObj, cells, i);

    should.exist(cells);
    should.exist(cells.heading);
    should.exist(cells.data);
    cells.data.should.be.empty();

    fn.deepCompare(cells, expectedCells).should.equal(true);
  });

  it('getHeadings should return headings in cells should return camelCase property headings', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done

    var wb = new xl.WorkBook();
    var ws = wb.WorkSheet("Test Workbook");
    var i = 0;
    var cells = {};
    cells.heading = [];
    cells.data = [];
    styleObj.data.headingStyles[0].useStyleHeadingsText = false;

    var data = [{
      "name": "monthlySummary",
      "data": [{
        "employeeNumber": "x1y2",
        "surname": "Sean",
        "firstName": "None",
        "totalAchievements": 3,
        "totalKudos": 10
      }]
    }];

    var expectedCells = {
      "heading": [{
        "ws": 0,
        "col": 1,
        "row": 1,
        "value": "employeeNumber"
      }, {
        "ws": 0,
        "col": 2,
        "row": 1,
        "value": "surname"
      }, {
        "ws": 0,
        "col": 3,
        "row": 1,
        "value": "firstName"
      }, {
        "ws": 0,
        "col": 4,
        "row": 1,
        "value": "totalAchievements"
      }, {
        "ws": 0,
        "col": 5,
        "row": 1,
        "value": "totalKudos"
      }],
      "data": []
    };

    mrData._private.getHeadings(ws, data, styleObj, cells, i);

    should.exist(cells);
    should.exist(cells.heading);
    should.exist(cells.data);
    cells.data.should.be.empty();

    fn.deepCompare(cells, expectedCells).should.equal(true);
  });

  it('getData should return correct data to Cells.data', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done

    var wb = new xl.WorkBook();
    var ws = wb.WorkSheet("Test Workbook");
    var i = 0;
    var cells = {};
    cells.heading = [];
    cells.data = [];
    styleObj.data.headingStyles[0].useStyleHeadingsText = false;

    var data = [{
      "name": "monthlySummary",
      "data": [{
        "employeeNumber": "x1y2",
        "surname": "Sean",
        "firstName": "None",
        "totalAchievements": 3,
        "totalKudos": 10
      }]
    }];

    var expectedCells = {
      heading: [],
      data: [{
        ws: 0,
        col: 1,
        row: 2,
        value: 'x1y2'
      }, {
        ws: 0,
        col: 2,
        row: 2,
        value: 'Sean'
      }, {
        ws: 0,
        col: 3,
        row: 2,
        value: 'None'
      }, {
        ws: 0,
        col: 4,
        row: 2,
        value: 3
      }, {
        ws: 0,
        col: 5,
        row: 2,
        value: 10
      }]
    };

    mrData._private.getData(ws, [], data, cells, i);
    //fn.dumpObjToFile(cells, "test/expectedCells.test");

    should.exist(cells);
    should.exist(cells.heading);
    should.exist(cells.data);

    fn.deepCompare(cells, expectedCells).should.equal(true);
  });

  it('getWorksheets should return empty array', function() {
    var result = mrData.getWorksheets();
    should.exist(result);
    result.should.be.empty();
  });

  it('getWorksheets should return array of worksheets', function() {
    var wb = new xl.WorkBook();
    var cells = {};
    cells.heading = [];
    cells.data = [];

    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;

    var expected = fs.readFileSync("test/expectedWorksheets");
    var result = util.inspect(mrData.getWorksheets(wb, reports, styleObj, cells), false, null);
    should.exist(result);
    fn.saveFile(result, "test/resultantWorksheets.test");

    //remove id refs
    fn.removeLineFromFile("test/resultantWorksheets.test", "'@Id'", 22); //line 1964
    fn.removeLineFromFile("test/resultantWorksheets.test", "'@Id'", 22); //line 1968
    fn.removeLineFromFile("test/resultantWorksheets.test", "'@Id'", 22); //line 1975
    fn.removeLineFromFile("test/resultantWorksheets.test", "'@Id'", 22); //line 3989
    fn.removeLineFromFile("test/resultantWorksheets.test", "'@Id'", 22); //line 3993
    fn.removeLineFromFile("test/resultantWorksheets.test", "'@Id'", 22); //line 4000

    result = fs.readFileSync("test/resultantWorksheets.test");
    fn.deepCompare(result, expected).should.equal(true);
  });
});
