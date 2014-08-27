#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var discoverPorts = require('../index');

var opts = require("nomnom")
  .option('version', {
    flag: true,
    help: 'Print version and exit',
    callback: function() {
      fs.readFile(path.resolve(__dirname, '../package.json'), 'utf-8', function(err, file) {
        console.log(JSON.parse(file).version);
      });
    }
  })
  .parse();

if (opts.version) return;

discoverPorts(function(err, ports){
  if (err) return console.log(err);
  console.log(ports);
});