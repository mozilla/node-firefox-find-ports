#!/usr/bin/env node

var exec = require('shelljs').exec,
  os = process.platform,
  B2G_BIN_OSX = 'b2g/B2G.app/Contents/MacOS/b2g-bin',
  FX_PROFILES_OSX = 'Library/Application Support/Firefox/Profiles',
  B2G_BIN_LINUX = 'b2g/b2g-bin',
  FX_PROFILES_LINUX = '.mozilla/firefox',
  NETSTAT_CMD = 'netstat -lnptu',
  LSOF_CMD = 'lsof -i -n -P -sTCP:LISTEN';

module.exports = discoverPorts;

function discoverPorts (callback) {
    ports = {firefox:[], b2g:[]};

    if (os == 'darwin') {
      var output = exec(LSOF_CMD, {silent: true}).output;
      // Example to match
      // b2g-bin   25779 mozilla   21u  IPv4 0xbbcbf2cee7ddc2a7      0t0  TCP 127.0.0.1:8000 (LISTEN)
      var regex = /^(b2g|firefox)(?:-bin)?[\ ]+([0-9]+).*[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:([0-9]+)/;
      var lines = output.split('\n');
      lines.forEach(function(line) {
        var matches = regex.exec(line);
        if (matches && +matches[3] != 2828) {
          ports[matches[1]].push({port: +matches[3], pid: +matches[2]});
        }

      });
 
    } else
    if (os == 'linux') {
        var output = exec(NETSTAT_CMD, {silent: true}).output;
        // Example to match
        // tcp        0      0 127.0.0.1:6000          0.0.0.0:*              LISTEN      3718/firefox 
        var regex = /tcp.*[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:([0-9]+).*LISTEN[\ ]+([0-9]+)\/(b2g|firefox)(?:-bin)?/;
        var lines = output.split('\n');
        lines.forEach(function(line) {
          var matches = regex.exec(line);
          if (matches && +matches[1] != 2828) {
            ports[matches[3]].push({port: +matches[1], pid: +matches[2],});
          }
        });
 
    } else {
        return callback(new Error("OS not supported for running"));
    }
 
    if (callback) callback(null, ports);
    return ports;
 
}
