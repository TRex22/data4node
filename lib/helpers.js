var exposed = {
  saveFile: saveFile,
  makeAFile: makeAFile,
  log: log,
  logObj: logObj,
  logStyles: logStyles,
  findArrObj:findArrObj,
  findArrObjFromName: findArrObjFromName,
  findCell: findCell,
  setDebug: setDebug
};
module.exports = exposed;

var debug = false;

function setDebug(flag) {
  debug = flag;
}

function saveFile(buf, outputFile) {
  // build file
  makeAFile(outputFile);
  fs.writeFileSync(outputFile, buf);
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

function findArrObj(arr, obj){
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === obj) return arr[i];
  }
  return null;
}

function findArrObjFromName(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === name) return arr[i];
  }
  return null;
}

function findCell(cells, ws, col, row) {
  for (var i = 0; i < cells.length; i++) {
    if (cells[i].col === col && cells[i].row === row && cells[i].ws === ws)
      return cells[i];
  }
  return null;
}
