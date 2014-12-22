/*
 * grunt-jasmine-node
 * https://github.com/omryn/grunt-simple-jasmine
 *
 * Copyright (c) 2014 Omry Nachman
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  function addReporters(jasmine, reporters) {
    var jasmineReporters = require('jasmine-reporters');
    Object.keys(reporters || {}).forEach(function (repName) {
      var repOptions = reporters[repName];
      if (repOptions) {
        if (jasmineReporters[repName] instanceof Function) {
          var reporter = new jasmineReporters[repName](repOptions);
          jasmine.addReporter(reporter);
        } else {
          grunt.warn('Invalid reporter: ' + repName);
        }

      }
    });
  }

  function makeTaskAsync(self, jasmine) {
    var done = self.async();
    jasmine.addReporter({
      jasmineDone: function () {
        done();
      }
    });
  }

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('simpleJasmine', 'Simple jasmine grunt plugin', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      reporters: {
        JUnitXmlReporter: false,
        NUnitXmlReporter: false,
        TapReporter: false,
        TeamcityReporter: false,
        TerminalReporter: false
      }
    });

    var path = require('path'),
        Command = require('jasmine/lib/command'),
        command = new Command(path.resolve()),
        Jasmine = require('jasmine/lib/jasmine'),
        jasmine = new Jasmine({projectBaseDir: path.resolve()});


    addReporters(jasmine, options.reporters);
    makeTaskAsync(this, jasmine);

    grunt.log.writeln('Running jasmine at ' + path.resolve());
    command.run(jasmine, []);
  });

};
