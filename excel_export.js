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

  var custStyles = getCustomStyles(styleObj, wb);

  setColWidth(worksheets, styleObj);
  setRowHeight(worksheets, styleObj);

  for (var i = 0; i < styleObj.data.cells.length; i++) {
    var ws = styleObj.data.cells[i].ws;
    var col = styleObj.data.cells[i].col;
    var row = styleObj.data.cells[i].row;
    var style = styleObj.data.cells[i].style;
    var type = styleObj.data.cells[i].type;
    var numberFormat = styleObj.data.cells[i].numberFormat;

    log("custStyle: " + findFromName(custStyles, style).data);
    log("custStyle name: " + findFromName(custStyles, style).name);
    var custStyle = findFromName(custStyles, style).data;
    log("worksheet: " + worksheets[ws]);

    var worksheet = worksheets.pop(ws);
    worksheet.Cell(row, col).Style(custStyle);

    //types - string already implicitly set
    if (type === "Number")
      worksheet.Cell(row, col).Number();
    if (type === "Formula")
      worksheet.Cell(row, col).Formula();
    //if (type === "Date") //special
    if (numberFormat)
      worksheet.Cell(row, col).Format.Number(numberFormat);

  }
  log("------------Stylizer Complete------------");
}

function setColWidth(worksheets, styleObj) {
  for (var i = 0; i < styleObj.data.columnWidth.length; i++) {
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

      worksheets[i].Column(prop).Width(p[prop]);
    }
  }
}

function setRowHeight(worksheets, styleObj) {
  for (var i = 0; i < styleObj.data.rowHeight.length; i++) {
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

      worksheets[i].Row(prop).Height(p[prop]);
    }
  }
}

function getCustomStyles(styleObj, wb) {
  var styles = [];

  //If there is not style then the data should just be pushed to the file as plain text.
  //This will only get the custStyles object
  for (var i = 0; i < styleObj.data.custStyles.length; i++) {
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
      var data = wb.Style();

      if (prop === ("bold")) {
        if (p[prop])
          data.Font.Bold();
      }
      if (prop === ("italics")) {
        if (p[prop])
          data.Font.Italics();
      }
      if (prop === ("underline")) {
        if (p[prop])
          data.Font.Underline();
      }

      if (prop === ("font.family"))
        data.Font.Family(p[prop]);
      if (prop === ("colour"))
        data.Font.Color(p[prop]);
      if (prop === ("size"))
        data.Font.Size(p[prop]);
      if (prop === ("alignmentVertical"))
        data.Font.Alignment.Vertical(p[prop]);
      if (prop === ("alignmentHorizontal"))
        data.Font.Alignment.Horizontal(p[prop]);
      if (prop === ("wrapText"))
        data.Font.WrapText(p[prop]);

      var style = {
        name: styleObj.data.custStyles[i].name,
        data: data
      };
    }
    styles.push(style);
  }
  log("------------Custom Styles Done------------")
  return styles;
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
