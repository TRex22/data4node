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

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function findFromName(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    log("arr[i]: =  " + arr[i].name);
    log("[i]: = " + [i]);
    if (arr[i].name === name) return arr[i];
  }
  return null;
}

var exposed = {
  saveFile: saveFile,
  makeAFile: makeAFile,
  log: log,
  logObj: logObj,
  logStyles: logStyles,
  isEmptyObject: isEmptyObject,
  findFromName: findFromName,
  setDebug: setDebug
}
module.exports = exposed;
