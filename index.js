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

  if (parser === undefined) {
    return callback(new Error(os + ' not supported yet'));
  } else {
    output = exec(command, { silent: true }).output;
    var lines = output.split('\n');
    results = parser(lines, search);
  }

  if (opts.detailed) {
    async.map(results, findDevice, function(err, res) {

      callback(err, filterByRelease(res, opts.release));

    });
  } else {
    callback(null, results);
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


function filterByRelease(results, release) {
  
  if(!release) {
    return results;
  }

  if(typeof release === 'string') {
    release = [ release ];
  }

  return results.filter(function(result) {
    var regex = new RegExp('^(' + release.join('|') + ')');
    return regex.exec(result.device.version);
  });

}
