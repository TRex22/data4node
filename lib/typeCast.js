var helper = require('./helpers.js');

var exposed = {
  convert: convert
};
module.exports = exposed;

function convert(type, col, row, ws, worksheets, numberFormat, cells) {
  //types - string already implicitly set
  var object = {
    row: row,
    col: col,
    type: type
  };
  //debugg(object);
  var worksheet = worksheets[ws];
  var cell;

  if (row === 1)
    cell = cells.heading[ws];
  else if (row > 1)
    cell = helper.findCell(cells.data, ws, col, row); //cells.data[col].value
  else {
    var err =
      "*******************Something is wrong with row typecasting.*******************";
    helper.log(err);
    throw err;
  }

  if (type === "Number") {
    helper.log("Type is Number.");
    helper.log("**Value: " + cell.value);
    //worksheet.Cell(row, col).Number(cell.value); //TODO JMC Fix
  }
  if (type === "Formula") {
    helper.log("Type is Formula.");
    worksheet.Cell(row, col).Formula(cell.value);
  }
  //if (type === "Date") //special
  if (numberFormat) {
    helper.log("Setting number format");
    worksheet.Cell(row, col).Format.Number(numberFormat);
  }
}
