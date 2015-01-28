var should = require('chai').should();
//var assert = require("assert");

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');


/*js to test*/
var xl_xp = require('../lib/data4node.js');
var helper = require('../lib/helpers.js');
var mrData = require('../lib/excel_export/mrData.js');
var stylizer = require('../lib/excel_export/stylizer.js');

var config = JSON.parse(fs.readFileSync("test/test_config.json"));
var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));

describe('#xl_xp', function() {
  it('createReports', function(){
    config.internalWbLibDebug = false;
    config.debug = false;
    config.fileWriter = false; //todo make a report and run a check on it
    xl_xp.createExcelReports(reports, styleObj, config);
  });

});
