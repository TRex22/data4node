/*
By Jason Chalom 2014
Under the MIT License

This handles the data collection for pretty much everything, uses parsers as well.
This is the correct handle for using parsers although they are public so that one may use it to their own means
*/
var helper = require('../helpers.js');

/*parsers*/
var jsonParser = require('../parser/jsonParser.js');
var csvParser = require('../parser/csv.js');
var scsvParser = require('../parser/scsv.js');

var exposed = {
  getJsonData: getJsonData
};
module.exports = exposed;

if (process.env.NODE_ENV === 'test') {
  module.exports._private = {
    createCells: createCells
  };
}

function getJsonData(reports, styleObj){
  var cells = mrData.createCells();
  cells = jsonParser.get(reports, styleObj, cells);
  return cells;
}

function createCells(){
  var cells = {};
  cells.name = "";
  cells.heading = [];
  cells.data = [];
  return cells;
}
