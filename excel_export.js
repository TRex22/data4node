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

  NB TODO: color is Colour in styles.json perhaps change this to American?

*/

log("Excel converter has started.");
//requirements
var xl = require('excel4node');
var fs = require('fs');
var http = require('http');

/*config*/
var config;
var debug = false;

function create(reports, styleObj, configuration) {
  if (configuration) {
    config = configuration;
    debug = config.debug;
  } else {
    config = JSON.parse(fs.readFileSync("excel_export/config.json"));
    debug = config.debug;
  }

  if (config.fileWriter) {
    /*Save directory for files*/
    var file = config.dir + config.filename;
  }

  if (config.testData) {
    /*Test Data*/
    var reports = JSON.parse(fs.readFileSync("" + config.dir + config.reportsFile));
    var styleObj = JSON.parse(fs.readFileSync("" + config.dir + config.stylesFile));
  }
  return makeExcelDocument(reports, styleObj, file);
}


function makeExcelDocument(reports, styleObj, file) {
  var wb = new xl.WorkBook();
  wb.debug = config.internalWbLibDebug;
  // print headings first

  var worksheets = getWorksheets(wb, reports, styleObj);
  if (isEmptyObject(styleObj)) {
    log("Reports Object is Empty.");
  }
  //if worksheets or styles is null then cry
  log("------------Raw Data Done------------");

  // run stylizer
  if (!isEmptyObject(styleObj)) {
    stylizer(styleObj, wb, worksheets);
  } else {
    log("Styles Object is Empty."); //TODO JMC add try-catches
  }


  if (config.fileWriter) {
    wb.write(file);
    console.log("file written.");
    return null;
  }

  log("------------Response------------\n" + wb);
  return wb;
}

function stylizer(styleObj, wb, worksheets) {
  //if no type is specified assume string
  //TODO update when excel4node has more type capabilities

  setColWidth(worksheets, styleObj);
  setRowHeight(worksheets, styleObj);
  var custStyles = getCustomStyles(styleObj, wb);
  //logObj(custStyles);
  setCustStyles(worksheets, styleObj, custStyles);

  log("------------Stylizer Complete------------");
}

function typeCast(type, row, col, worksheet, numberFormat) {
  //types - string already implicitly set
  if (type === "Number") {
    log("Type is Number.");
    worksheet.Cell(row, col).Number();
  }
  if (type === "Formula") {
    log("Type is Formula.");
    worksheet.Cell(row, col).Formula();
  }
  //if (type === "Date") //special
  if (numberFormat) {
    log("Setting number format");
    worksheet.Cell(row, col).Format.Number(numberFormat);
  }
}

function setColWidth(worksheets, styleObj) {
  for (var i = 0; i < styleObj.data.columnWidth.length; i++) {
    log("setting col width");
    var p = styleObj.data.columnWidth[i];
    var prop;
    var k = 0;
    for (prop in p) {
      if (!p.hasOwnProperty(prop)) {
        //The current property is not a direct property of p
        log("alert! " + prop + " -> " + p[prop]);
        continue;
      }
      log("col: " + prop + " : " + p[prop]);
      //log("setting size for worksheet: " + i + " name: " + worksheets[i].name);
      worksheets[i].Column(prop).Width(p[prop]);
    }
  }
}

function setRowHeight(worksheets, styleObj) {
  for (var i = 0; i < styleObj.data.rowHeight.length; i++) {
    log("setting row height");
    var p = styleObj.data.rowHeight[i];
    var prop;
    var k = 0;
    for (prop in p) {
      if (!p.hasOwnProperty(prop)) {
        //The current property is not a direct property of p
        log("alert! " + prop + " -> " + p[prop]);
        continue;
      }
      log("row " + prop + " : " + p[prop]);
      //log("setting size for worksheet: " + i + " name: " + worksheets[i].name);
      worksheets[i].Row(prop).Height(p[prop]);
    }
  }
}

function getCustomStyles(styleObj, wb) {
  log("------------Custom Styles------------");
  var styles = [];
  for (var i = 0; i < styleObj.data.custStyles.length; i++) {
    var style = {};
    style.name = styleObj.data.custStyles[i].name;
    style.data = wb.Style();

    var p = styleObj.data.custStyles[i].data;
    var prop;
    var k = 0;
    for (prop in p) {
      if (!p.hasOwnProperty(prop)) {
        //The current property is not a direct property of p
        log("alert! " + prop + " -> " + p[prop]);
        continue;
      }
      log(prop + " : " + p[prop]);

      if (p[prop] === ("bold")) {
        if (p[prop])
          style.data.Font.Bold();
      }
      if (p[prop] === ("italics")) {
        if (p[prop])
          style.data.Font.Italics();
      }
      if (p[prop] === ("underline")) {
        if (p[prop])
          style.data.Font.Underline();
      }

      if (prop === ("fontFamily"))
        style.data.Font.Family(p[prop]);
      if (prop === ("colour"))
        style.data.Font.Color(p[prop]);
      if (prop === ("size"))
        style.data.Font.Size(p[prop]);
      if (prop === ("fillPattern"))
        style.data.Fill.Pattern(p[prop]);
      if (prop === ("fillColour"))
        style.data.Fill.Color(p[prop]);
      if (prop === ("alignmentVertical"))
        style.data.Font.Alignment.Vertical(p[prop]);
      if (prop === ("alignmentHorizontal"))
        style.data.Font.Alignment.Horizontal(p[prop]);
      if (prop === ("wrapText"))
        style.data.Font.WrapText(p[prop]);
    }
    styles.push(style);
  }
  log("------------Custom Styles Objects Created------------");
  return styles;
}

function setCustStyles(worksheets, styleObj, custStyles) {
  for (var i = 0; i < styleObj.data.cells.length; i++) {
    var ws = styleObj.data.cells[i].ws;
    var worksheet = worksheets[ws];

    var col = styleObj.data.cells[i].col;
    var row = styleObj.data.cells[i].row;
    var style = styleObj.data.cells[i].style;
    var type = styleObj.data.cells[i].type;
    var numberFormat = styleObj.data.cells[i].numberFormat;

    logStyles(styleObj.data.cells[i]);

    if (style) {
      var custStyle = findFromName(custStyles, style).data;
      log("custStyle: " + custStyle.data +
        "custStyle name: " + custStyle.name);
      log("worksheet: " + worksheets[ws]);
      worksheet.Cell(row, col).Style(custStyle);
    }

    typeCast(type, row, col, worksheet, numberFormat);
  }
  log("------------Custom Styles Objects Set------------");
}


function getWorksheets(wb, reports, styleObj) {
  //check if null
  var worksheets = [];
  if (isEmptyObject(reports))
    return worksheets; //TODO JMC Error reporting

  for (var i = 0; i < reports.length; i++) {
    var ws = wb.WorkSheet(reports[i].name);
    log(reports[i].name);

    var p = styleObj.data.headings[i];
    var prop;
    var k = 0;

    //do headings override from styles json
    if (isEmptyObject(p) || config.useStylesHeadings == false) {
      //take heading names from reports property names
      p = reports[i].data[0]; //only need the first data point
      for (prop in p) {
        if (!p.hasOwnProperty(prop)) {
          //The current property is not a direct property of p
          log("alert! " + prop + " -> " + p[prop]);
          continue;
        }
        if (i == 0) { //j+2 to leave space for headings
          ws.Cell(1, i + k + 1).String("" + prop); //fix for r c going from 1,1
        } else {
          ws.Cell(1, i + k).String("" + prop);
        }
        k++;
      }
    } else {
      for (prop in p) {
        if (!p.hasOwnProperty(prop)) {
          //The current property is not a direct property of p
          log("alert! " + prop + " -> " + p[prop]);
          continue;
        }
        log(prop + " : " + p[prop]);
        if (i == 0) { //j+2 to leave space for headings
          ws.Cell(1, i + k + 1).String("" + p[prop]); //fix for r c going from 1,1
        } else {
          ws.Cell(1, i + k).String("" + p[prop]);
        }
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
          log("alert! " + prop + " -> " + p[prop]);
          continue;
        }
        log(prop + " : " + p[prop]);
        if (i == 0) { //j+2 to leave space for headings
          ws.Cell(j + 2, i + k + 1).String("" + p[prop]); //fix for r c going from 1,1
        } else {
          ws.Cell(j + 2, i + k).String("" + p[prop]);
        }
        k++;
      }
    }
    worksheets.push(ws);
  }
  return worksheets;
}


void

function saveExcelFile(xlsBuf, outputFile) {
  // build file
  makeAFile(outputFile);
  fs.writeFileSync(outputFile, xlsBuf);
}

void

function makeAFile(file) {
  fs.writeFile(file, "", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was created!");
    }
  });
}

function log(p, prop) {
  if (debug)
    log(prop + " : " + p[prop]);
}

function log(str) {
  if (debug)
    console.log("log: " + str);
}

function logObj(obj) {
  log("obj: " + obj.name + " " + JSON.stringify(obj))
}

function logStyles(styleObj) {
  var ws = styleObj.ws;
  var col = styleObj.col;
  var row = styleObj.row;
  var style = styleObj.style;
  var type = styleObj.type;
  var numberFormat = styleObj.numberFormat;

  log("style objs");
  log("ws: " + ws);
  log("col: " + col);
  log("row: " + row);
  log("style: " + style);
  log("type: " + type);
  log("numberFormat " + numberFormat);
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function findFromName(arr, obj) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === obj) return arr[i];
    else return null;
  }
}

var exposed = {
  create: create
}


module.exports = exposed;
