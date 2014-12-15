var exposed = {
  saveFile: saveFile,
  makeAFile: makeAFile,
  log: log,
  logObj: logObj,
  logStyles: logStyles,
  findFromName: findFromName,
  findCell: findCell,
  setDebug: setDebug
};
module.exports = exposed;

var debug = false;

function setDebug(flag) {
  debug = flag;
}

function saveFile(xlsBuf, outputFile) {
  // build file
  makeAFile(outputFile);
  fs.writeFileSync(outputFile, xlsBuf);
}

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

function findFromName(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === name) return arr[i];
  }
  return null;
}

function findCell(cells, row, col) {
  for (var i = 0; i < cells.length; i++) {
    if (cells[i].col === col && cells[i].row === row)
      return cells[i];
  }
  return null;
}
