#!/bin/bash
./node_modules/.bin/istanbul cover --report lcovonly && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
./node_modules/.bin/mocha --reporter spec