/*Custom helper test functions for the unit or endpoint tests
Cannot use helper since this tests the helpers lib*/

/*By Jason Chalom 2014, Entelect Software
Under the MIT License

This handles the unit test functions. helper.js cannot be used because it is unit tested.
This may cause some code duplication
*/

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');

var exposed = {
  returnFile: returnFile,
  makeAFile: makeAFile,
  saveFile: saveFile,
  dumpObjToFile: dumpObjToFile,
  appendFile: appendFile,
  removeLineFromFile: removeLineFromFile,
  quickCompare: quickCompare,
  deepCompare: deepCompare
};
module.exports = exposed;

function returnFile(file) {
  fs.readFile(file, {
    encoding: 'utf-8'
  }, function(err, data) {
    if (!err) {
      console.log('received data: ' + data);
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.write(data);
      response.end();
      return data();
    } else {
      console.log(err);
      return err;
    }

  });
}

function makeAFile(file) {
  fs.writeFile(file, "", function(err) {
    if (err) {
      console.log(err);
    }
  });
}

function saveFile(buf, outputFile) {
  // build file
  makeAFile(outputFile);
  fs.writeFileSync(outputFile, buf);
}

function dumpObjToFile(obj, outputFile){
  saveFile(util.inspect(obj, false, null), outputFile);
}

function appendFile(file, search, line) {
  line = line || 0;

  var body = fs.readFileSync(file).toString();

  if (body.indexOf(search) < 0) {

    body = body.split('\n');
    body.splice(line + 1, 0, search);
    body = body.filter(function(str) {
      return str;
    }); // remove empty lines
    var output = body.join('\n');
    fs.writeFileSync('example.js', output);
  }
}

function removeLineFromFile(file, search) {
  var body = fs.readFileSync(file).toString();
  var idx = body.indexOf(search);

  if (idx >= 0) {
    var output = body.substr(0, idx) + body.substr(idx + search.length);
    fs.writeFileSync(file, output);
  }
}

function removeLineFromFile(file, search, addIndex) {
  var body = fs.readFileSync(file).toString();
  var idx = body.indexOf(search);

  if (idx >= 0) {
    var output = body.substr(0, idx) + body.substr(idx + search.length + addIndex);
    fs.writeFileSync(file, output);
  }
}

function quickCompare(x, y) {
  var xObj = JSON.stringify(x);
  var yObj = JSON.stringify(y);
  if (x === y)
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
