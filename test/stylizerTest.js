var should = require('chai').should();
//var assert = require("assert");

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');

var fn = require('./customTestFunctions.js');

/*js to test*/
var stylizer = require('../lib/excel_export/stylizer.js');
var helper = require('../lib/helpers.js');
var mrData = require('../lib/mrData/mrData.js');

var config = JSON.parse(fs.readFileSync("test/test_config.json"));
var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));

//_private.

// setBatchHeadingStyles: setBatchHeadingStyles,
// setBatchDataStyles: setBatchDataStyles,
// setColProperties: setColProperties,
// setCellStyle: setCellStyle,
// setCustCellStyles: setCustCellStyles,
// setColWidth: setColWidth,
// setRowHeight: setRowHeight
// setCustStyles: setCustStyles,
// shazam

describe('#stylizer', function() {
  it('getCustomStyles returns empty array', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;
    styleObj.data.custStyles = [];

    var wb = new xl.WorkBook();

    stylizer._private.getCustomStyles(styleObj, wb).should.be.empty();
  });

  it('getCustomStyles returns array of styles', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;

    styleObj.data.custStyles = [{
      "name": "style1",
      "data": {
        "fontBold": true,
        "fontItalics": false,
        "fontUnderline": false,
        "fontFamily": "Britannic Bold",
        "fontColor": "#34DDDD",
        "fontSize": 20,
        "fillPattern": "solid",
        "fillColor": "#333333",
        "alignmentVertical": "top",
        "alignmentHorizontal": "left",
        "wrapText": true,
        "border": {
          "top": {
            "style": "thin",
            "color": "CCCCCC"
          },
          "bottom": {
            "style": "thick"
          },
          "left": {
            "style": "thin"
          },
          "right": {
            "style": "thin"
          }
        }
      }
    }];
    var wb = new xl.WorkBook();

    var expected = fs.readFileSync("test/expectedCustStyles");
    var result = stylizer._private.getCustomStyles(styleObj, wb);
    fn.dumpObjToFile(result, "test/custStyles.test");

    //remove id tags
    fn.removeLineFromFile("test/custStyles.test", "'@Id'", 22); //line 300
    fn.removeLineFromFile("test/custStyles.test", "'@Id'", 22); //line 304
    fn.removeLineFromFile("test/custStyles.test", "'@Id'", 22); //line 311

    result = fs.readFileSync("test/custStyles.test");
    fn.deepCompare(result, expected).should.equal(true);
  });

  it('setBatchHeadingStyles', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;
    styleObj.data.custStyles = [];
    var cells = {};
    cells.heading = [];
    cells.data = [];

    var wb = new xl.WorkBook();
    var ws = wb.WorkSheet("Test Workbook");
    var i = 0;
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

    var worksheets = mrData.getWorksheets(wb, reports, styleObj, cells);
    mrData._private.getHeadings(ws, data, styleObj, cells, i);
    var custStyles = fs.readFileSync("test/expectedCustStyles");

    var expected = fs.readFileSync("test/expectedBatchHeadingStyles");

    stylizer._private.setBatchHeadingStyles(worksheets, styleObj, custStyles, cells);
    fn.dumpObjToFile(worksheets, "test/resultantBatchHeadingStyles.test");

    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 1971
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 1975
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 1982
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 4003
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 4007
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 4014

    result = fs.readFileSync("test/resultantBatchHeadingStyles.test");
    fn.deepCompare(result, expected).should.equal(true);
  });

  it('setBatchDataStyles', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;
    styleObj.data.custStyles = [];
    var cells = {};
    cells.heading = [];
    cells.data = [];

    var wb = new xl.WorkBook();
    var ws = wb.WorkSheet("Test Workbook");
    var i = 0;
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

    var worksheets = mrData.getWorksheets(wb, reports, styleObj, cells);
    mrData._private.getHeadings(ws, data, styleObj, cells, i);
    var custStyles = fs.readFileSync("test/expectedCustStyles");

    var expected = fs.readFileSync("test/expectedBatchDataStyles");

    stylizer._private.setBatchDataStyles(worksheets, styleObj, custStyles, cells);
    fn.dumpObjToFile(worksheets, "test/resultantBatchDataStyles.test");

    fn.removeLineFromFile("test/resultantBatchDataStyles.test", "'@Id'", 22); //line 2040
    fn.removeLineFromFile("test/resultantBatchDataStyles.test", "'@Id'", 22); //line 2044
    fn.removeLineFromFile("test/resultantBatchDataStyles.test", "'@Id'", 22); //line 2051
    fn.removeLineFromFile("test/resultantBatchDataStyles.test", "'@Id'", 22); //line 4141
    fn.removeLineFromFile("test/resultantBatchDataStyles.test", "'@Id'", 22); //line 4145
    fn.removeLineFromFile("test/resultantBatchDataStyles.test", "'@Id'", 22); //line 4152

    result = fs.readFileSync("test/resultantBatchDataStyles.test");
    fn.deepCompare(result, expected).should.equal(true);
  });

  it('setBatchHeadingStyles', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;
    styleObj.data.custStyles = [];
    var cells = {};
    cells.heading = [];
    cells.data = [];

    var wb = new xl.WorkBook();
    var ws = wb.WorkSheet("Test Workbook");
    var i = 0;
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

    var worksheets = mrData.getWorksheets(wb, reports, styleObj, cells);
    mrData._private.getHeadings(ws, data, styleObj, cells, i);
    var custStyles = fs.readFileSync("test/expectedCustStyles");

    var expected = fs.readFileSync("test/expectedBatchHeadingStyles");

    stylizer._private.setBatchHeadingStyles(worksheets, styleObj, custStyles, cells);
    fn.dumpObjToFile(worksheets, "test/resultantBatchHeadingStyles.test");

    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 1971
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 1975
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 1982
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 4003
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 4007
    fn.removeLineFromFile("test/resultantBatchHeadingStyles.test", "'@Id'", 22); //line 4014

    result = fs.readFileSync("test/resultantBatchHeadingStyles.test");
    fn.deepCompare(result, expected).should.equal(true);
  });

  it('setColProperties', function() {
    config.debug = false;
    config.internalWbLibDebug = false;
    helper.setDebug(false); //has to be done
    styleObj.data.headingStyles[0].useStyleHeadingsText = true;
    styleObj.data.custStyles = [];
    var cells = {};
    cells.heading = [];
    cells.data = [];

    var wb = new xl.WorkBook();
    var ws = wb.WorkSheet("Test Workbook");
    var i = 0;
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

    var worksheets = mrData.getWorksheets(wb, reports, styleObj, cells);
    mrData._private.getHeadings(ws, data, styleObj, cells, i);
    var custStyles = fs.readFileSync("test/expectedCustStyles");

    var expected = fs.readFileSync("test/expectedColProperties");

    stylizer._private.setColProperties(worksheets, reports, styleObj, custStyles, cells);
    fn.dumpObjToFile(worksheets, "test/resultantColProperties.test");

    fn.removeLineFromFile("test/resultantColProperties.test", "'@Id'", 22); //line 6101
    fn.removeLineFromFile("test/resultantColProperties.test", "'@Id'", 22); //line 6105
    fn.removeLineFromFile("test/resultantColProperties.test", "'@Id'", 22); //line 6112
    fn.removeLineFromFile("test/resultantColProperties.test", "'@Id'", 22); //line 12263
    fn.removeLineFromFile("test/resultantColProperties.test", "'@Id'", 22); //line 12267
    fn.removeLineFromFile("test/resultantColProperties.test", "'@Id'", 22); //line 12274

    result = fs.readFileSync("test/resultantColProperties.test");
    fn.deepCompare(result, expected).should.equal(true);
  });

  // it('setCellStyle', function() {
  //   config.debug = false;
  //   config.internalWbLibDebug = false;
  //   helper.setDebug(false); //has to be done
  //   styleObj.data.headingStyles[0].useStyleHeadingsText = true;
  //   styleObj.data.custStyles = [];
  //
  //   var cells = {};
  //   cells.heading = [];
  //   cells.data = [];
  //
  //   var wb = new xl.WorkBook();
  //   var ws = wb.WorkSheet("Test Workbook");
  //   var i = 0;
  //   var data = [{
  //     "name": "monthlySummary",
  //     "data": [{
  //       "employeeNumber": "x1y2",
  //       "surname": "Sean",
  //       "firstName": "None",
  //       "totalAchievements": 3,
  //       "totalKudos": 10
  //     }]
  //   }];
  //
  //   mrData._private.getHeadings(ws, data, styleObj, cells, i);
  //   var custStyles = fs.readFileSync("test/expectedCustStyles");
  //
  //   // var expected = fs.readFileSync("test/expectedCellStyle");
  //
  //   stylizer._private.setCellStyle(ws, 1, 1, custStyles[0].data);
  //   fn.dumpObjToFile(ws, "test/resultantCellStyle.test");
  //
  //   // fn.removeLineFromFile("test/resultantCellStyle.test", "'@Id'", 22); //line 6101
  //   // fn.removeLineFromFile("test/resultantCellStyle.test", "'@Id'", 22); //line 6105
  //   // fn.removeLineFromFile("test/resultantCellStyle.test", "'@Id'", 22); //line 6112
  //   // fn.removeLineFromFile("test/resultantCellStyle.test", "'@Id'", 22); //line 12263
  //   // fn.removeLineFromFile("test/resultantCellStyle.test", "'@Id'", 22); //line 12267
  //   // fn.removeLineFromFile("test/resultantCellStyle.test", "'@Id'", 22); //line 12274
  //
  //   result = fs.readFileSync("test/resultantCellStyle.test");
  //   fn.deepCompare(result, expected).should.equal(true);
  // });

});
