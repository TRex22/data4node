/*Unit tests for parsers and BabelFish, may use external dependencies*/
var should = require('chai').should();

var fs = require('fs');
var xl = require('excel4node');
var util = require('util');

var fn = require('./customTestFunctions.js');
var parser = require('../lib/parser/babelFish.js');

describe('#parser', function() {
  it('parser.csv.parseToCsv', function() {
    var data = [
      [
        "Make",
        "Model",
        "Year"
      ],
      [
        "Ford",
        "Fiesta Mk5 Reface",
        "2003"
      ],
      [
        "Honda",
        "Civic",
        "2013"
      ]
    ];

    var expectedStr = "Make,Model,Year\nFord,Fiesta Mk5 Reface,2003\nHonda,Civic,2013";
    var test = parser.csv.parseToCsv(data);
    fn.quickCompare(test, expectedStr).should.equal(true);
  });

  it('parser.csv.parseToDataObj', function() {
    var str = "Make,Model,Year\nFord,Fiesta Mk5 Reface,2003\nHonda,Civic,2013";
    var expectedData = [
      [
        "Make",
        "Model",
        "Year"
      ],
      [
        "Ford",
        "Fiesta Mk5 Reface",
        "2003"
      ],
      [
        "Honda",
        "Civic",
        "2013"
      ]
    ];
    var test = parser.csv.parseToDataObj(str);
    fn.deepCompare(test, expectedData).should.equal(true);
  });

  it('parser.scsv.parseToScsv', function() {
    var data = [
      [
        "Make",
        "Model",
        "Year"
      ],
      [
        "Ford",
        "Fiesta Mk5 Reface",
        "2003"
      ],
      [
        "Honda",
        "Civic",
        "2013"
      ]
    ];

    var expectedStr = "Make;Model;Year\nFord;Fiesta Mk5 Reface;2003\nHonda;Civic;2013";
    var test = parser.scsv.parseToScsv(data);
    fn.quickCompare(test, expectedStr).should.equal(true);
  });

  it('parser.scsv.parseToDataObj', function() {
    var str = "Make;Model;Year\nFord;Fiesta Mk5 Reface;2003\nHonda;Civic;2013";
    var expectedData = [
      [
        "Make",
        "Model",
        "Year"
      ],
      [
        "Ford",
        "Fiesta Mk5 Reface",
        "2003"
      ],
      [
        "Honda",
        "Civic",
        "2013"
      ]
    ];
    var test = parser.scsv.parseToDataObj(str);
    fn.deepCompare(test, expectedData).should.equal(true);
  });
});
