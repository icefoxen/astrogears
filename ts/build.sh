#!/bin/sh

echo Generating typescript...
python3 geargen.py > geargen-out.ts
cat astrogears-template.ts geargen-out.ts > astrogears.ts

echo Building typescript...
tsc -t es6 astrogears.ts --out astrogears-es6.js
echo Turning fancy-ass ES2015 javascript to old-ass javascript... 
babel astrogears-es6.js -o astrogears-built.js --presets es2015