#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var colors = require('colors');
var discoverPorts = require('../index');
var Table = require('cli-table');

var table = new Table({
  chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
  style: { 'padding-left': 0, 'padding-right': 4 }
});

var types = {b2g: "Firefox OS", firefox:"Firefox Desktop"};

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
  .option('b2g', {
    flag: true,
    help: 'Show Boot2Gecko (FirefoxOS) listening ports only'
  })
  .option('detailed', {
    flag: true,
    help: 'Show details of each Remote Debugger'
  })
  .option('firefox', {
    flag: true,
    help: 'Show Firefox Desktop listening ports only'
  })
  .option('json', {
    flag: true,
    help: 'Formats in json'
  })
  .parse();

if (opts.version) return;

discoverPorts(opts, function(err, instances){
  if (err) return console.log(err);
  if (opts.json) return console.log(instances);

  var header = ['TYPE', 'PORT', 'PID']
  if (opts.detailed) header = ['TYPE', 'PORT', 'PID', 'VERSION']

  table.push(header);

  instances.forEach(function(instance, i) {
    var row = [types[instance.type].bold, instance.port, instance.pid]
    if (opts.detailed) row = [types[instance.type].bold, instance.port, instance.pid, instance.device.version]
    table.push(row);
  })

  console.log(table.toString())

});