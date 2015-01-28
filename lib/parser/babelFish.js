/*BabelFish is the main parser hook*/

/*By Jason Chalom 2014, Entelect Software
  Under the MIT License
*/
var helper = require('../helpers.js');
var csv = require('./csv.js');
var scsv = require('./scsv.js');

var exposed = {
  csv: csv,
  scsv: scsv
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {

  };
}
