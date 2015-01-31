var should = require('chai').should();
//var assert = require("assert");

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');


/*js to test*/
var data4node = require('../lib/data4node.js');
var helper = require('../lib/helpers.js');
var mrData = require('../lib/mrData/mrData.js');
var stylizer = require('../lib/excel_export/stylizer.js');

var config = JSON.parse(fs.readFileSync("test/test_config.json"));
var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));

describe('#xl_xp', function() {
  it('createReports', function(){
    config.internalWbLibDebug = false;
    config.debug = false;
    config.fileWriter = false; //todo make a report and run a check on it
    data4node.createExcelReports(reports, styleObj, config);
  });

  it('createHtmlFromJson', function(){
    var data =
    {
      t1: "hello",
      t2: {
        h1: "bye",
        h2: "225552",
        H3: 1337
      }
    };
    var testOut = data4node.createHtmlListFromJson(data);
    console.log(testOut);
  });
});
