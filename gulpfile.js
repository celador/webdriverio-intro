'use strict';

var gulp = require('gulp');
var webdriver = require('gulp-webdriver');
var mocha = require('gulp-mocha');
var argv = require('yargs').argv;

gulp.task('webdriver', function () { 
    return gulp.src('./wdio.conf.js').pipe(webdriver());
});
 
gulp.task('tdd-this', function () {
    
  if (argv.file) {
    console.log('Testing file ' + argv.file);
    
	return gulp.src(argv.file, {read: false})
		.pipe(mocha({reporter: 'spec'}));
  } else {
    console.log('Please supply a --file parameter');
  }
    
});
