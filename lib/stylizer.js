/*By Jason Chalom 2014, Entelect Software
Under the MIT License

This handles the styling
*/
var util = require('util');
var helper = require('./helpers.js');
var typeCast = require('./typeCast.js');

var exposed = {
  shazam: shazam
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {
    getCustomStyles: getCustomStyles,
    setCustStyles: setCustStyles,
    setBatchHeadingStyles: setBatchHeadingStyles,
    setBatchDataStyles: setBatchDataStyles,
    setColProperties: setColProperties,
    setCellStyle: setCellStyle,
    setCustCellStyles: setCustCellStyles,
    setColWidth: setColWidth,
    setRowHeight: setRowHeight
  };
}

function shazam(reports, styleObj, wb, worksheets, cells) {
  //if no type is specified assume string
  //TODO update when excel4node has more type capabilities

  var custStyles = getCustomStyles(styleObj, wb);
  setCustStyles(worksheets, reports, styleObj, custStyles, cells);

  setColWidth(worksheets, styleObj);
  setRowHeight(worksheets, styleObj);

  helper.log("------------Stylizer Complete------------");
}

function getCustomStyles(styleObj, wb) {
  helper.log("------------Custom Styles------------");
  var styles = [];
  //debugg(styleObj);
  for (var i = 0; i < styleObj.data.custStyles.length; i++) {
    helper.log("Create Style Count: " + i);

    var style = {};
    style.name = styleObj.data.custStyles[i].name;
    style.data = wb.Style();
    helper.log("----------------- " + "Style: " + style.name);
    var styleProp = styleObj.data.custStyles[i].data;

    if (styleProp.fontBold)
      style.data.Font.Bold();

    if (styleProp.fontItalics)
      style.data.Font.Italics();

    if (styleProp.fontUnderline)
      style.data.Font.Underline();

    style.data.Font.Family(styleProp.fontFamily);
    style.data.Font.Color(styleProp.fontColor);
    style.data.Font.Size(styleProp.fontSize);
    style.data.Fill.Pattern(styleProp.fillPattern);
    style.data.Fill.Color(styleProp.fillColor);
    style.data.Font.Alignment.Vertical(styleProp.alignmentVertical);
    style.data.Font.Alignment.Horizontal(styleProp.alignmentHorizontal);
    style.data.Font.WrapText(styleProp.wrapText);
    if (styleProp.border) {
      style.data.Border({
        top: {
          style: styleProp.border.top.style,
          color: styleProp.border.top.color
        },
        bottom: {
          style: styleProp.border.bottom.style,
          color: styleProp.border.bottom.color
        },
        left: {
          style: styleProp.border.left.style,
          color: styleProp.border.left.color
        },
        right: {
          style: styleProp.border.right.style,
          color: styleProp.border.right.color
        }
      });
    }

    styles.push(style);
  }
  helper.log("------------Custom Styles Objects Created------------");
  helper.log("Styles OBJ: " + styles);
  //debugg(styles);  
  return styles;
}

function setCustStyles(worksheets, reports, styleObj, custStyles, cells) {
  //set batch cells first and then follow individual cell mods
  helper.log("------------Starting Batch Styling------------");
  setBatchHeadingStyles(worksheets, styleObj, custStyles, cells);
  setBatchDataStyles(worksheets, styleObj, custStyles, cells);
  setColProperties(worksheets, reports, styleObj, custStyles, cells);
  helper.log("------------Batch Styling Done----------------");
  setCustCellStyles(worksheets, styleObj, custStyles, cells);
  helper.log("------------Custom Styles Objects Set------------");
}

function setBatchHeadingStyles(worksheets, styleObj, custStyles, cells) {
  if (cells.heading.length !== 0 && styleObj.data.headingStyles) {
    for (var i = 0; i < cells.heading.length; i++) {
      var ws = cells.heading[i].ws;

      if (styleObj.data.headingStyles[ws]) {
        var worksheet = worksheets[ws];
        var col = cells.heading[i].col;
        var row = cells.heading[i].row;
        var style = styleObj.data.headingStyles[ws].style; //refers to style arr index

        helper.log("Style: " + style);
        if (style) {
          var custStyle = helper.findArrObjFromName(custStyles, style);
          helper.log("custStyle OBJ: " + custStyle);
          if (custStyle) {
            helper.log("custStyle: " + custStyle.data +
              " custStyle name: " + custStyle.name);
            helper.log("worksheet: " + worksheets[ws]);
            setCellStyle(worksheet, col, row, custStyle);
          } else {
            helper.log("No style named: " + style + " found");
          }
        }
        if (styleObj.data.headingStyles[ws].freezeHeadingsRow) {
          worksheet.Row(2).Freeze(2);
        }
      }
    }
    helper.log("------------Batch Headings Styles Set------------");
  }
}

function setBatchDataStyles(worksheets, styleObj, custStyles, cells) {
  if (cells.data.length !== 0 && styleObj.data.dataStyles) { //TODO JMC check if needed, empty data still has meta-data
    for (var i = 0; i < cells.data.length; i++) {
      var ws = cells.data[i].ws;

      if (styleObj.data.headingStyles[ws]) {
        var worksheet = worksheets[ws];
        var col = cells.data[i].col;
        var row = cells.data[i].row;
        var style = styleObj.data.dataStyles[ws].style; //refers to style arr index
        var type = styleObj.data.dataStyles[ws].type;
        var numberFormat = styleObj.data.dataStyles[ws].numberFormat;

        helper.log("Style: " + style);
        if (style) {
          var custStyle = helper.findArrObjFromName(custStyles, style);
          helper.log("custStyle OBJ: " + custStyle);
          if (custStyle) {
            helper.log("custStyle: " + custStyle.data +
              " custStyle name: " + custStyle.name);
            helper.log("worksheet: " + worksheets[ws]);
            setCellStyle(worksheet, col, row, custStyle);
          } else {
            helper.log("No style named: " + style + " found");
          }
        }
        if (type)
          typeCast.convert(type, col, row, ws, worksheets, numberFormat,
            cells);
      }
    }
    helper.log("------------Batch Data Styles Set------------");
  }
}

function setColProperties(worksheets, reports, styleObj, custStyles, cells) {
  //check if there are specific col settings
  if (styleObj.data.colStyles) {
    for (var i = 0; i < styleObj.data.colStyles.length; i++) {
      var ws = styleObj.data.colStyles[i].ws;
      var worksheet = worksheets[ws];

      var col = styleObj.data.colStyles[i].col;
      var style = styleObj.data.colStyles[i].style;
      var type = styleObj.data.colStyles[i].type;
      var numberFormat = styleObj.data.colStyles[i].numberFormat;
      var freezeCol = styleObj.data.colStyles[i].freezeCol;
      var enforceHeadingStyle = styleObj.data.colStyles[i].enforceHeadingStyle;

      if (style) {
        var custStyle = helper.findArrObjFromName(custStyles, style);
        if (custStyle) {
          //loop the row for number of data points that way keep things from crashing
          for (var j = 0; j < reports[ws].data.length; j++) { //TODO FIX ws wrong
            var row = (j + 1);
            if (enforceHeadingStyle)
              row++;
            setCellStyle(worksheet, col, row, custStyle); //hack to count last row
          }
        } else {
          helper.log("No style named: " + style + " found");
        }
      }
      if (type) {
        for (var j = 0; j < reports[ws].data.length; j++) {
          var row = (j + 2);
          typeCast.convert(type, col, row, ws, worksheets, numberFormat,
            cells);
        }
      }
    }
    helper.log("------------Batch Col Styles Set------------");
  }
}

function setCellStyle(worksheet, col, row, custStyle) {
  worksheet.Cell(row, col).Style(custStyle.data);
}

function setCustCellStyles(worksheets, styleObj, custStyles, cells) {
  for (var i = 0; i < styleObj.data.cells.length; i++) {
    if (styleObj.data.cells[i].ws < worksheets.length) {
      var ws = styleObj.data.cells[i].ws;
      var worksheet = worksheets[ws];

      var col = styleObj.data.cells[i].col;
      var row = styleObj.data.cells[i].row;
      var style = styleObj.data.cells[i].style; //refers to style arr index
      var type = styleObj.data.cells[i].type;
      var numberFormat = styleObj.data.cells[i].numberFormat;

      helper.log("Styles OBJ: " + custStyles);
      if (style) {
        var custStyle = helper.findArrObjFromName(custStyles, style);
        if (custStyle) {
          helper.log("custStyle: " + custStyle.data +
            " custStyle name: " + custStyle.name);
          helper.log("worksheet: " + worksheets[ws]);
          setCellStyle(worksheet, col, row, custStyle);
        } else {
          helper.log("No style named: " + style + " found");
        }
      }
      if (type) {
        typeCast.convert(type, col, row, ws, worksheets, numberFormat, cells);
      }
    } else {
      helper.log("No worksheet of that number: " + styleObj.data.cells[i].ws);
    }
  }
}

function setColWidth(worksheets, styleObj) {
  for (var i = 0; i < styleObj.data.columnWidth.length; i++) {
    helper.log("setting col width");
    var p = styleObj.data.columnWidth[i];
    var prop;
    var k = 0;
    for (prop in p) {
      helper.log("col: " + prop + " : " + p[prop]);
      worksheets[i].Column(prop).Width(p[prop]);
    }
  }
}

function setRowHeight(worksheets, styleObj) {
  for (var i = 0; i < styleObj.data.rowHeight.length; i++) {
    helper.log("setting row height");
    var p = styleObj.data.rowHeight[i];
    var prop;
    var k = 0;
    for (prop in p) {
      helper.log("row " + prop + " : " + p[prop]);
      worksheets[i].Row(prop).Height(p[prop]);
    }
  }
}
