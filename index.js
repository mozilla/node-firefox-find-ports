'use strict';

var exec = require('shelljs').exec;
var async = require('async');
var FirefoxClient = require('firefox-client');
var os = process.platform;
var parsers = require('./lib/parsers');
var commands = {
  darwin: 'lsof -i -n -P -sTCP:LISTEN',
  linux: 'netstat -lnptu'
};

module.exports = findPorts;

function findPorts(opts, callback) {
  opts = opts || {};
  var ports = [];
  var search = [];
  var output;

  if (!opts.firefox && !opts.firefoxOSSimulator) {
    search = ['firefox', 'b2g'];
  }
  if (opts.firefox) {
    search.push('firefox');
  }
  if (opts.firefoxOSSimulator) {
    search.push('b2g');
  }

  if (opts.release && opts.release.length > 0) {
    opts.detailed = true;
  }

  var command = commands[os];
  var parser = parsers[os];

  if (parser === undefined) {
    return callback(new Error(os + ' not supported yet'));
  } else {
    output = exec(command, {silent: true}).output;
    var lines = output.split('\n');
    ports = parser(lines, search);
  }

  if (opts.detailed) {
    async.map(ports, findDevice, function(err, results) {
      if (!opts.release) {
        return callback(err, results);
      }

      if (typeof opts.release === 'string') {
        opts.release = [opts.release];
      }

      callback(err, results.filter(function(instance) {
        var regex = new RegExp('^(' + opts.release.join('|') + ')');
        return regex.exec(instance.device.version);
      }));

    });
  } else {
    callback(null, ports);
  }
}

function findDevice(instance, callback) {
  var client = new FirefoxClient();
  client.connect(instance.port, function(err) {
    if (err) {
      return callback(err);
    }

    client.getDevice(function(err, device) {
      if (err) {
        return callback(err);
      }

      device.getDescription(function(err, deviceDescription) {
        if (err) {
          return callback(err);
        }

        instance.device = deviceDescription;
        instance.release = deviceDescription.version;
        client.disconnect();
        callback(null, instance);
      });
    });
  });
}
