/*majorTom is the main hook for the exporter module*/

/*By Jason Chalom 2014, Entelect Software
Under the MIT License
*/
var helper = require('../helpers.js');
var objToHtmlExport = require('./objToHtmlExport.js');

var exposed = {
  objToHtmlExport : objToHtmlExport
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {

  };
}
