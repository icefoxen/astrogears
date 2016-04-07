#!/bin/sh
# Crude setup for Debian systems

# Install node.js

curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

# Update npm
sudo npm update -g npm

# Install npm deps
sudo npm install -g typescript
sudo npm install -g babel-cli babel-preset-stage-0 babel-preset-es2015 babel-polyfill
sudo npm install -g browserify tsify babelify
browserify astrogears.js -o astrogears-built.js -t babelify
