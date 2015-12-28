#!/bin/bash
echo 'Increment version number'
echo 'will not push to master only develop, master inherits version from latest merged develop'
npm version patch
git add --all
git commit -am "[ci skip] prod number increment"
git push origin develop
