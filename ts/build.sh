#!/bin/sh

# requires babel, babel-preset-stage-0, babel-preset-es2015, babel-polyfill
# babel-polyfill has to be included in the output file one way or another...
# Ugh.
echo Building typescript...
tsc -t es2015 astrogears.ts
echo Turning fancy-ass ES2015 javascript to old-ass javascript... 
babel astrogears.js -o astrogears-built.js
echo "Open astrogears.html in a browser to see it work."
