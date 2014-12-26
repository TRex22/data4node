/*By Jason Chalom 2014, Entelect Software
Under the MIT License

This contains all helper functions
*/

var exposed = {
  saveFile: saveFile,
  makeAFile: makeAFile,
  log: log,
  logObj: logObj,
  findArrObj: findArrObj,
  findArrObjFromName: findArrObjFromName,
  findCell: findCell,
  setDebug: setDebug,
  getDebug: getDebug,
  quickCompare: quickCompare,
  deepCompare: deepCompare,
  removeLineFromFile: removeLineFromFile,
  appendFile: appendFile,
  dumpObjToFile: dumpObjToFile,
  isEmpty: isEmpty,
  pseudoRandGen: pseudoRandGen,
  removeLineEndings: removeLineEndings,
  readFile: readFile,
  readFileLinesArr: readFileLinesArr,
  readFileStreamLines: readFileStreamLines
};
module.exports = exposed;

var debug = false;

var fs = require('fs');
var util = require('util');

function removeNewLinesFromString(str){
  str = removeLineEndings(str);
}

function readFile(file) {
  fs.readFile(file, function (err, data) {
    if (err)
      return err;
    return data.toString();
  });
}

function readFileLinesArr(file, regex) {
  fs.readFile(file, function (err, data) {
    if (err)
      return err;
    var ds = data.toString();
    if (!regex)
      regex = "\n";
    return ds.split(regex);;
    });
}

function readFileStreamLines(file, func) {//http://jesusjzp.github.io/blog/2014/04/15/nodejs-read-file/
  var input = fs.createReadStream(file);
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}

function removeLineEndings(str){
  return str.replace(/\n|\r|\n\r|\r\n/g, '');
}

function pseudoRandGen(a, b, m){//predicatble pseudo rnd number
  var high = 999;
  var low = 0;

  var now = new Date();

  a = (now*44)%999; //arbitrary numbers, could use some kind of seed there as well
  b = (now*876)%999;
  m = (now*78)%999;

  return Math.floor(((a*now+b) % m) + Math.random() * (high - low) + low);
}

function isEmpty(obj) {

  // null and undefined are "empty"
  if (obj === null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

function setDebug(flag) {
  debug = flag;
}

function getDebug() {
  return debug;
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

function dumpObjToFile(obj, outputFile){
  saveFile(util.inspect(obj, false, null), outputFile);
}

function appendFile(file, search, line) {
  line = line || 0;

  var body = fs.readFileSync(file).toString();

  if (body.indexOf(search) < 0 ) {

    body = body.split('\n');
    body.splice(line + 1,0,search);
    body = body.filter(function(str){ return str; }); // remove empty lines
    var output = body.join('\n');
    fs.writeFileSync('example.js', output);
  }
}

function removeLineFromFile(file, search) {
  var body = fs.readFileSync(file).toString();
  var idx = body.indexOf(search);

  if (idx >= 0 ) {
    var output = body.substr(0, idx) + body.substr(idx + search.length);
    fs.writeFileSync(file, output);
  }
}

function removeLineFromFile(file, search, addIndex) {
  var body = fs.readFileSync(file).toString();
  var idx = body.indexOf(search);

  if (idx >= 0 ) {
    var output = body.substr(0, idx) + body.substr(idx + search.length + addIndex);
    fs.writeFileSync(file, output);
  }
}

function log(p, prop) {
  if (debug)
    log(prop + " : " + p[prop]);
  return "" + prop + " : " + p[prop];
}

function log(str) {
  if (debug)
    console.log("log: " + str);
  return "log: " + str;
}

function logObj(obj) {
  log("obj: " + util.inspect(obj, false, null));
  return "obj: " + util.inspect(obj, false, null);
}

function findArrObj(arr, obj) {
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

function quickCompare(x, y) {
  var xObj = JSON.stringify(x);
  var yObj = JSON.stringify(y);
  if (xObj === yObj)
    return true;
  return false;
}

function deepCompare() {
  var i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on step when comparing prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good a we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object beeing a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof(x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
}
