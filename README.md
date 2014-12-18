data4node [![Build Status](https://travis-ci.org/TRex22/data4node.svg)](https://travis-ci.org/TRex22/data4node) [![Stories in Ready](https://badge.waffle.io/TRex22/data4node.png?label=ready&title=Ready)](https://waffle.io/TRex22/data4node)
============
A set of libraries and wrappers to handle modern filetypes from within nodejs

json_xl4node
============
A JSON wrapper for excel4node
-----------------------------

By Jason Chalom 2014, Entelect Software
Under the MIT License

I have other commitments at the moment but I will come back and finish this library at some point.

This will take some test json data and convert to xlsx using desired styling and formatting
https://github.com/natergj/excel4node is the excel parser

to use a stream and not write to file, just use buildExcelDataFromJson and push where-ever its the base-64 string
always save as xlsx the other formats may not work correctly.

Styles must have headings
Styles all have arrays for each main object. This corresponds to specific worksheets
Sub-object arrays sometimes correspond to headings, or image number or cell locations.

custStyles are linked directly at the cell level

Documentation is coming soon.

TODOs: see Waffle.io or Github issues

## Tests

npm test

Any file *.test is ignored by git. By convention these are the test files where test data is dumped to drive.

The object compares instead of the should.equals in some unit tests is not ensure that the endpoint tests dont crash mocha
