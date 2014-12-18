'use strict';

// See https://github.com/jshint/jshint/issues/1747 for context
/* global -Promise */

var Promise = require('es6-promise').Promise;
var exec = require('shelljs').exec;
var FirefoxClient = require('firefox-client');
var os = process.platform;
var parsers = require('./lib/parsers');
var commands = {
  darwin: 'lsof -i -n -P -sTCP:LISTEN',
  linux: 'netstat -lnptu'
};

module.exports = findPorts;

function findPorts(opts) {
  opts = opts || {};
  var results = [];
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

  return new Promise(function(resolve, reject) {

    if (parser === undefined) {
      return reject(new Error(os + ' not supported yet'));
    }

    output = exec(command, { silent: true }).output;
    var lines = output.split('\n');
    results = parser(lines, search);

    if (!opts.detailed) {
      return resolve(results);
    }

    return Promise.all(results.map(getDeviceInfo))
      .then(function(detailedResults) {
        resolve(filterByRelease(detailedResults, opts.release));
      });

  });

}


function getDeviceInfo(instance) {

  return new Promise(function(resolve, reject) {
    
    var client = new FirefoxClient();

    client.connect(instance.port, function(err) {

      if (err) {
        return reject(err);
      }

      client.getDevice(function(err, device) {

        if (err) {
          return reject(err);
        }

        device.getDescription(function(err, deviceDescription) {

          if (err) {
            return reject(err);
          }

          instance.device = deviceDescription;
          instance.release = deviceDescription.version;
          client.disconnect();
          resolve(instance);

        });

      });

    });

  });

}


function filterByRelease(results, release) {
  
  if (!release) {
    return results;
  }

  if (typeof release === 'string') {
    release = [ release ];
  }

  return results.filter(function(result) {
    var regex = new RegExp('^(' + release.join('|') + ')');
    return regex.exec(result.device.version);
  });

}
