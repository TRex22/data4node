var should = require('chai').should();
//var assert = require("assert");

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');


/*js to test*/
var data4node = require('../lib/data4node.js');
var helper = require('../lib/helpers.js');
var mrData = require('../lib/mrData/mrData.js');
var stylizer = require('../lib/stylizer/stylizer.js');

var config = JSON.parse(fs.readFileSync("test/test_config.json"));
var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));

describe('#data4node reports', function() {
  it('createExcelReport', function(){
    config.internalWbLibDebug = false;
    config.debug = false;
    config.fileWriter = false; //todo make a report and run a check on it
    data4node.createExcelReports(reports, styleObj, config);
  });

  //it('createExcelTimeTable', function(){
  //  config.internalWbLibDebug = false;
  //  config.debug = false;
  //  config.fileWriter = false; //todo make a report and run a check on it
  //  data4node.createExcelTimeTable(reports, styleObj, config);
  //});

  it('createCsvReport', function(){
    var data = [
      [
        "Make",
        "Model",
        "Year"
      ],
      [
        "Ford",
        "Fiesta Mk5 Reface",
        "2003"
      ],
      [
        "Honda",
        "Civic",
        "2013"
      ]
    ];

    var expectedStr = "Make,Model,Year\nFord,Fiesta Mk5 Reface,2003\nHonda,Civic,2013";
    data4node.createCsvReport(data).should.equal(expectedStr);
  });

  it('createScsvReport', function(){
    var data = [
      [
        "Make",
        "Model",
        "Year"
      ],
      [
        "Ford",
        "Fiesta Mk5 Reface",
        "2003"
      ],
      [
        "Honda",
        "Civic",
        "2013"
      ]
    ];

    var expectedStr = "Make;Model;Year\nFord;Fiesta Mk5 Reface;2003\nHonda;Civic;2013";
    data4node.createScsvReport(data).should.equal(expectedStr);
  });

  //it('createHtmlFromJson', function(){
  //  var data =
  //  {
  //    t1: "hello",
  //    t2: {
  //      h1: "bye",
  //      h2: "225552",
  //      H3: 1337
  //    }
  //  };
  //  var testOut = data4node.createHtmlListFromJson(data);
  //  console.log(testOut);
  //});
});
