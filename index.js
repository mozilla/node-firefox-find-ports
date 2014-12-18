'use strict';

var exec = require('shelljs').exec;
var Promise = require('es6-promise').Promise;
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
    Promise.all(results.map(getDeviceInfo)).then(function(detailedResults) {
      callback(null, filterByRelease(detailedResults, opts.release));
    });
  } else {
    callback(null, results);
  }
}


function getDeviceInfo(instance) {

  return new Promise(function(resolve, reject) {
    
    var client = new FirefoxClient();

    client.connect(instance.port, function(err) {

      if(err) {
        return reject(err);
      }

      client.getDevice(function(err, device) {

        if(err) {
          return reject(err);
        }

        device.getDescription(function(err, deviceDescription) {

          if(err) {
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
