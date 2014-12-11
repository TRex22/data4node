json_xl4node [![Build Status](https://travis-ci.org/TRex22/json_xl4node.svg)](https://travis-ci.org/TRex22/json_xl4node) [![Stories in Ready](https://badge.waffle.io/TRex22/json_xl4node.png?label=ready&title=Ready)](https://waffle.io/TRex22/json_xl4node)
============

A JSON wrapper for excel4node
-----------------------------

By Jason Chalom 2014, Entelect Software
Under the MIT License

This will take some test json data and convert to xlsx using desired styling and formatting
https://github.com/natergj/excel4node is the excel parser

to use a stream and not write to file, just use buildExcelDataFromJson and push where-ever its the base-64 string
always save as xlsx the other formats may not work correctly.

Styles must have headings
Styles all have arrays for each main object. This corresponds to specific worksheets
Sub-object arrays sometimes correspond to headings, or image number or cell locations.

custStyles are linked directly at the cell level

NB TODO: color is Colour in styles.json perhaps change this to American?

TODO:
----- 
  Find TODOs
  Add Log Levels
  Make tests
  Setup TravisCi
  Default Styles
  Headings either from styles or by default properties from the data json
  Error Catching
  stylizer
  Type Setting
  Excel Functions
  error log file
  built in server POSTS and GETS
  heading options like special styles and location.
  Move whole data and order
  add more styles
  add ability for external config for testing purposes
  add proper log messages when debug is off
  add cnfig row col or col row
  allow wb.debug
  create tables from inputted data
  add documentation, wiki
  add proper build status for each branch


