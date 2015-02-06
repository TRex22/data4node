#!/bin/bash
./node_modules/.bin/istanbul cover
./node_modules/.bin/mocha --reporter spec
