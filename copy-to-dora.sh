#!/bin/bash
cd `dirname $0`
rm ../dora-engine/public/index.html
rm ../dora-engine/public/static/js/main-quiz.*.js
rm ../dora-engine/public/static/css/main-quiz.*.css
cp ./build/index.html ../dora-engine/public/
cp ./build/static/js/main.*.js ../dora-engine/public/static/js/
cp ./build/static/css/main.*.css ../dora-engine/public/static/css/
