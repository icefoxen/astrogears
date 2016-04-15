#!/bin/sh
# Crude setup for Debian systems

sudo apt-get install npm 

# Install node.js

#curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
#sudo apt-get install -y nodejs

# Update npm
sudo npm update -g npm

# Install npm deps
npm install babel-preset-es2015 babel-polyfill typescript babel-cli
#npm install browserify tsify babelify
