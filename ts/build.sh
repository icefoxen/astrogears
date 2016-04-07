#!/bin/sh

# requires babel, babel-preset-stage-0, babel-preset-es2015, babel-polyfill
# babel-polyfill has to be included in the output file one way or another...
# Ugh.
# Redo this to use npm or browserify?
echo Building typescript...
tsc -t es6 astrogears.ts --out astrogears-es6.js
echo Turning fancy-ass ES2015 javascript to old-ass javascript... 
babel astrogears-es6.js -o astrogears-built.js --presets es2015
#browserify astrogears.ts -o astrogears.js -p [ tsify --target=es6 ] -t [ babelify --presets [ es6 ] ]

# AAAAARUGHFJDSKFJDLSAFJSL
## How the fuck do we make browserify do this as a single step???
#browserify astrogears.ts -o astrogears-es6.js -p [ tsify --target=es6 ] 
#browserify astrogears-es6.js -o bundle.js -t [ babelify --presets [ es2015 ] ]
#echo "Open astrogears.html in a browser to see it work."
