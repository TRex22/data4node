/*By Jason Chalom 2014, Entelect Software
  Under the MIT License
  This will take some test json data and convert to xlsx using desired styling and formatting
  https://github.com/natergj/excel4node

  to use a stream and not write to file, just use buildExcelDataFromJson and push where-ever its the base-64 string
  always save as xlsx the other formats may not work correctly.

  Styles must have headings
  Styles all have arrays for each main object. This corresponds to specific worksheets
  Sub-object arrays sometimes correspond to headings, or image number or cell locations.
  cells have a ws prop which is the worksheet number, computer readable

  custStyles are linked directly at the cell level
*/

//requirements
var xl = require('excel4node');
var fs = require('fs');
var http = require('http');
var helper = require('./helpers.js');

helper.log("Excel converter has started.");

/*config*/
var config;
var debug = false;

function createReports(reports, styles, configuration) {
  if (configuration) {
    config = configuration;
    debug = config.debug;
  } else {
    config = JSON.parse(fs.readFileSync("excel_export/config.json"));
    debug = config.debug;
  }
  helper.setDebug(debug);

  if (config.fileWriter) {
    /*Save directory for files*/
    var file = config.dir + config.filename;
  }

  if (config.testData) {
    /*Test Data*/
    var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
    var styles = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));
  }
  return makeExcelDocument(reports, styles, file);
}


function makeExcelDocument(reports, styleObj, file) {
  var wb = new xl.WorkBook();
  wb.debug = config.internalWbLibDebug;
  // print headings first

  var cells = {};
  cells.heading = [];
  cells.data = [];

  var worksheets = getWorksheets(wb, reports, styleObj, cells.heading,
    cells.data);

  helper.log("------------Raw Data Done------------");

  // run stylizer
  if (!helper.isEmptyObject(styleObj)) {
    stylizer(styleObj, wb, worksheets, cells);
  } else {
    helper.log("Styles Object is Empty."); //TODO JMC add try-catches
  }


  if (config.fileWriter) {
    wb.write(file);
    console.log("file written.");
    return null;
  }

  helper.log("------------Response------------\n" + wb);
  return wb;
}

function stylizer(styleObj, wb, worksheets, cells) {
  //if no type is specified assume string
  //TODO update when excel4node has more type capabilities

  setColWidth(worksheets, styleObj);
  setRowHeight(worksheets, styleObj);
  var custStyles = getCustomStyles(styleObj, wb);
  //helper.helper.logObj(custStyles);
  setCustStyles(worksheets, styleObj, custStyles, cells);

  helper.log("------------Stylizer Complete------------");
}

function typeCast(type, row, col, worksheet, numberFormat) {
  //types - string already implicitly set
  if (type === "Number") {
    helper.log("Type is Number.");
    worksheet.Cell(row, col).Number();
  }
  if (type === "Formula") {
    helper.log("Type is Formula.");
    worksheet.Cell(row, col).Formula();
  }
  //if (type === "Date") //special
  if (numberFormat) {
    helper.log("Setting number format");
    worksheet.Cell(row, col).Format.Number(numberFormat);
  }
}

function setColWidth(worksheets, styleObj) {
  for (var i = 0; i < styleObj.data.columnWidth.length; i++) {
    helper.log("setting col width");
    var p = styleObj.data.columnWidth[i];
    var prop;
    var k = 0;
    for (prop in p) {
      if (!p.hasOwnProperty(prop)) {
        //The current property is not a direct property of p
        helper.log("alert! " + prop + " -> " + p[prop]);
        continue;
      }
      helper.log("col: " + prop + " : " + p[prop]);
      //helper.log("setting size for worksheet: " + i + " name: " + worksheets[i].name);
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
      if (!p.hasOwnProperty(prop)) {
        //The current property is not a direct property of p
        helper.log("alert! " + prop + " -> " + p[prop]);
        continue;
      }
      helper.log("row " + prop + " : " + p[prop]);
      //helper.log("setting size for worksheet: " + i + " name: " + worksheets[i].name);
      worksheets[i].Row(prop).Height(p[prop]);
    }
  }
}

function getCustomStyles(styleObj, wb) {
  helper.log("------------Custom Styles------------");
  var styles = [];
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
  return styles;
}

function setCustStyles(worksheets, styleObj, custStyles, cells) {
  //set batch cells first and then follow individual cell mods
  helper.log("------------Starting Batch Styling------------");
  setBatchHeadingStyles(worksheets, styleObj, custStyles, cells);
  setBatchDataStyles(worksheets, styleObj, custStyles, cells);
  helper.log("------------Batch Styling Done----------------");
  setCustCellStyles(worksheets, styleObj, custStyles);
  helper.log("------------Custom Styles Objects Set------------");
}

function setBatchHeadingStyles(worksheets, styleObj, custStyles, cells){
  if (cells.heading.length != 0 && styleObj.data.headingStyles) {
    for (var i = 0; i < cells.heading.length; i++) {
      var ws = cells.heading[i].ws;

      if(styleObj.data.headingStyles[ws]){
        var worksheet = worksheets[ws];
        var col = cells.heading[i].col;
        var row = cells.heading[i].row;
        var style = styleObj.data.headingStyles[ws].style; //refers to style arr index

        helper.log("Style: " + style);
        if (style) {
          var custStyle = helper.findFromName(custStyles, style);
          helper.log("custStyle OBJ: " + custStyle);
          if (custStyle) {
            helper.log("custStyle: " + custStyle.data +
            " custStyle name: " + custStyle.name);
            helper.log("worksheet: " + worksheets[ws]);
            setCellStyle(worksheet, col, row, custStyle);
          }
          else {
            helper.log("No style named: " + style + " found");
          }
        }
        if(styleObj.data.headingStyles[ws].freezeHeadingsRow){
          worksheet.Row(2).Freeze(2);
        }
      }
    }
    helper.log("------------Batch Headings Styles Set------------");
  }
}

function setBatchDataStyles(worksheets, styleObj, custStyles, cells){
  if (cells.data.length != 0 && styleObj.data.dataStyles) {
    for (var i = 0; i < cells.data.length; i++) {
      var ws = cells.data[i].ws;

      if(styleObj.data.headingStyles[ws]){
        var worksheet = worksheets[ws];
        var col = cells.data[i].col;
        var row = cells.data[i].row;
        var style = styleObj.data.dataStyles[ws].style; //refers to style arr index
        //var type = styleObj.data.cells[i].type;
        //var numberFormat = styleObj.data.cells[i].numberFormat;

        helper.log("Style: " + style);
        if (style) {
          var custStyle = helper.findFromName(custStyles, style);
          helper.log("custStyle OBJ: " + custStyle);
          if (custStyle) {
            helper.log("custStyle: " + custStyle.data +
            " custStyle name: " + custStyle.name);
            helper.log("worksheet: " + worksheets[ws]);
            setCellStyle(worksheet, col, row, custStyle);
          }
          //typeCast(type, row, col, worksheet, numberFormat);
          else {
            helper.log("No style named: " + style + " found");
          }
        }
      }
    }
    helper.log("------------Batch Data Styles Set------------");
  }
}

function setCustCellStyles(worksheets, styleObj, custStyles){
  for (var i = 0; i < styleObj.data.cells.length; i++) {
    if (styleObj.data.cells[i].ws < worksheets.length) {
      var ws = styleObj.data.cells[i].ws;
      var worksheet = worksheets[ws];

      var col = styleObj.data.cells[i].col;
      var row = styleObj.data.cells[i].row;
      var style = styleObj.data.cells[i].style; //refers to style arr index
      var type = styleObj.data.cells[i].type;
      var numberFormat = styleObj.data.cells[i].numberFormat;

      helper.logStyles(styleObj.data.cells[i]);
      helper.log("Styles OBJ: " + custStyles);
      if (style) {
        var custStyle = helper.findFromName(custStyles, style);
        if (custStyle) {
          helper.log("custStyle: " + custStyle.data +
            " custStyle name: " + custStyle.name);
          helper.log("worksheet: " + worksheets[ws]);
          setCellStyle(worksheet, col, row, custStyle);
        } else {
          helper.log("No style named: " + style + " found");
        }
      }
      //typeCast(type, row, col, worksheet, numberFormat);
    } else {
      helper.log("No worksheet of that number: " + ws);
    }
  }
}

function setCellStyle(worksheet, col, row, custStyle){
  worksheet.Cell(row, col).Style(custStyle.data);
}

function getWorksheets(wb, reports, styleObj, headingCells, dataCells) {
  //check if null
  var worksheets = [];
  if (helper.isEmptyObject(reports))
    return worksheets; //TODO JMC Error reporting

  for (var i = 0; i < reports.length; i++) {
    var ws = wb.WorkSheet(reports[i].name);
    helper.log(reports[i].name);

    var p = styleObj.data.headingsText[i];
    var prop;
    var k = 0;

    //do headings override from styles json
    if (helper.isEmptyObject(p) || config.useStyleHeadings == false) {
      //take heading names from reports property names
      p = reports[i].data[0]; //only need the first data point
      for (prop in p) {
        if (!p.hasOwnProperty(prop)) {
          //The current property is not a direct property of p
          helper.log("alert! " + prop + " -> " + p[prop]);
          continue;
        }
        var col;
        if (i == 0) { //j+2 to leave space for headings
          col = i + k + 1;
        } else {
          col = i + k;
        }
        //typeCast
        ws.Cell(1, col).String("" + prop); //fix for r c going from 1,1
        headingCells.push({
          "ws": i,
          "col": col,
          "row": 1
        });
        k++;
      }
    } else {
      for (prop in p) {
        if (!p.hasOwnProperty(prop)) {
          //The current property is not a direct property of p
          helper.log("alert! " + prop + " -> " + p[prop]);
          continue;
        }
        helper.log(prop + " : " + p[prop]);
        var col;
        if (i == 0) { //j+2 to leave space for headings
          col = i + k + 1;
        } else {
          col = i + k;
        }
        //typeCast
        ws.Cell(1, col).String("" + p[prop]); //fix for r c going from 1,1
        headingCells.push({
          "ws": i,
          "col": col,
          "row": 1
        });
        k++;
      }
    }

    //insert data will be string for now. The typecasting will happen in styling
    for (var j = 0; j < reports[i].data.length; j++) {
      var p = reports[i].data[j];
      var prop; //property in p
      var k = 0;
      for (prop in p) {
        if (!p.hasOwnProperty(prop)) {
          //The current property is not a direct property of p
          helper.log("alert! " + prop + " -> " + p[prop]);
          continue;
        }
        helper.log(prop + " : " + p[prop]);
        var row = j + 2;
        var col;
        if (i == 0) { //j+2 to leave space for headings
          col = i + k + 1;
        } else {
          col = i + k;
        }
        ws.Cell(row, col).String("" + p[prop]);
        dataCells.push({
          "ws": i,
          "col": col,
          "row": row
        });
        k++;
      }
    }
    worksheets.push(ws);
  }
  return worksheets;
}



var exposed = {
  createReports: createReports
};

module.exports = exposed;
