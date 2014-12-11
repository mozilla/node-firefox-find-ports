'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var nodeunit = require('gulp-nodeunit');

var sourceFiles = [
  'examples/*.js',
  'lib/*.js',
  'tests/*.js',
  'gulpfile.js',
  'index.js'
];

// JS Style checks
gulp.task('jscs', function() {
  return gulp.src(sourceFiles)
    .pipe(jscs());
});

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src(sourceFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    // Task should fail if JSHint finds errors.
    .pipe(jshint.reporter('fail'));
});

// Run Unit tests
gulp.task('nodeunit', function() {
  return gulp.src('tests/unit-*.js')
    .pipe(nodeunit({
      reporter: 'junit',
      reporterOptions: {
        output: 'test'
      }
    }));
});

gulp.task('test', ['jshint', 'jscs', 'nodeunit']);

gulp.task('default', ['test']);
