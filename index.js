#!/usr/bin/env node

var exec = require('shelljs').exec;
var async = require('async');
var FirefoxClient = require('firefox-client');
var os = process.platform;
var NETSTAT_CMD = 'netstat -lnptu';
var LSOF_CMD = 'lsof -i -n -P -sTCP:LISTEN';

module.exports = discoverPorts;

function discoverPorts () {
  var args = arguments;
  var callback;
  var opts = {detailed:false};

  /* Overloading */

  // discoverPorts({b2g: true, firefox:true, detailed:false})
  if (typeof args[0] == 'object') {
    opts = args[0];
  }

  // discoverPorts(..., callback)
  if (typeof args[args.length-1] == 'function') {
    callback = args[args.length-1];
  }

  var ports = [];

  /* Options */
  var search = [];
  if (!opts.firefox && !opts.b2g) {
    search = ['firefox', 'b2g'];
  }
  if (opts.firefox) search.push('firefox');
  if (opts.b2g) search.push('b2g');

  /* Commands */

  if (os == 'darwin') {
    var output = exec(LSOF_CMD, {silent: true}).output;
    // Example to match
    // b2g-bin   25779 mozilla   21u  IPv4 0xbbcbf2cee7ddc2a7      0t0  TCP 127.0.0.1:8000 (LISTEN)
    var regex = new RegExp("^("+ search.join('|') +")(?:-bin)?[\\ ]+([0-9]+).*[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+:([0-9]+)");
    var lines = output.split('\n');
    lines.forEach(function(line) {
      var matches = regex.exec(line);
      if (matches && +matches[3] != 2828) {
        ports.push({type: matches[1], port: +matches[3], pid: +matches[2]});
      }

    });

  } else
  if (os == 'linux') {
    var output = exec(NETSTAT_CMD, {silent: true}).output;
    // Example to match
    // tcp        0      0 127.0.0.1:6000          0.0.0.0:*              LISTEN      3718/firefox 
    var regex = new RegExp("tcp.*[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+:([0-9]+).*LISTEN[\\ ]+([0-9]+)\\/("+ search.join('|') +")(?:-bin)?");
    var lines = output.split('\n');
    lines.forEach(function(line) {
      var matches = regex.exec(line);
      if (matches && +matches[1] != 2828) {
        ports.push({type: matches[3], port: +matches[1], pid: +matches[2],});
      }
    });

  } else {
    return callback(new Error("OS not supported for running"));
  }

  if (opts.detailed)
    async.map(ports, discoverDevice, callback);
  else
    callback(null, ports);
}

function discoverDevice (instance, callback) {
  var client = new FirefoxClient();
  client.connect(instance.port, function() {
    client.getDevice(function(err, device) {
      device.getDescription(function(err, deviceDescription) {
        instance.device = deviceDescription;
        client.disconnect();
        callback(null, instance);
      });
    });
  });
}