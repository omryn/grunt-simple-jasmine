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

  function slugishDebugWorkAround(jasmine, global) {
    if (global.v8debug) {
      jasmine.env.beforeAll(function () {
        // Sluginsh debug mode workaround
        global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
      })
    }
  }

  grunt.registerMultiTask('simpleJasmine', 'Simple jasmine grunt plugin', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      reporters: {
        JUnitXmlReporter: false,
        NUnitXmlReporter: false,
        TapReporter: false,
        TeamcityReporter: false,
        TerminalReporter: false
      },
      spec_dir: "spec",
      spec_files: ["**/*[sS]pec.js"],
      helpers: ["**/*[Hh]elper?.js"]
    });


    var path = require('path'),
        Jasmine = require('jasmine/lib/jasmine'),
        jasmine = new Jasmine();

    slugishDebugWorkAround(jasmine, global);

    jasmine.loadConfig(options);
    addReporters(jasmine, options.reporters);
    jasmine.configureDefaultReporter({
      onComplete: this.async()
    });
    jasmine.execute();
  });

};
