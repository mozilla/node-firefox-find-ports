'use strict';

/*
 * We will discard connections on port 2828 as those are the ones that Marionette uses
 * For more info: https://developer.mozilla.org/en-US/docs/Marionette_Test_Runner
 */

var MARIONETTE_PORT = 2828;

function parserDarwin(lines, search) {
  var ports = [];
  // Example syntax:
  // b2g-bin   25779 mozilla   21u  IPv4 0xbbcbf2cee7ddc2a7      0t0  TCP 127.0.0.1:8000 (LISTEN)
  var regex = new RegExp(
    '^(' + search.join('|') +
    ')(?:-bin)?[\\ ]+([0-9]+).*[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+:([0-9]+)'
  );

  lines.forEach(function(line) {
    var matches = regex.exec(line);

    /*jshint eqeqeq:false*/
    if (matches && +matches[3] != MARIONETTE_PORT) {
      ports.push({type: matches[1], port: +matches[3], pid: +matches[2]});
    }
  });
  return ports;
}

function parserLinux(lines, search) {
  var ports = [];
  // Example syntax:
  // tcp        0      0 127.0.0.1:6000          0.0.0.0:*              LISTEN      3718/firefox
  var regex = new RegExp(
    'tcp.*[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+:([0-9]+).*LISTEN[\\ ]+([0-9]+)\\/(' +
    search.join('|') + ')(?:-bin)?'
  );

  lines.forEach(function(line) {
    var matches = regex.exec(line);

    /*jshint eqeqeq:false*/
    if (matches && +matches[1] != MARIONETTE_PORT) {
      ports.push({type: matches[3], port: +matches[1], pid: +matches[2]});
    }
  });
  return ports;
}

// TODO: Windows parser (and add it below!)

module.exports = {
  darwin: parserDarwin,
  linux: parserLinux
};
