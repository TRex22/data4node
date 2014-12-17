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

//_private.

// getCustomStyles: getCustomStyles,
// setCustStyles: setCustStyles,
// setBatchHeadingStyles: setBatchHeadingStyles,
// setBatchDataStyles: setBatchDataStyles,
// setColProperties: setColProperties,
// setCellStyle: setCellStyle,
// setCustCellStyles: setCustCellStyles,
// setColWidth: setColWidth,
// setRowHeight: setRowHeight

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

});
