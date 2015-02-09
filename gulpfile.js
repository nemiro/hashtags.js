/**
 * Created by inemiro on 1/13/15.
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var closureCompiler = require('gulp-closure-compiler');
var to5 = require("gulp-6to5");
var esnext = require("gulp-esnext");
var sourcemaps = require("gulp-sourcemaps");

gulp.task('styles', function () {
  "use strict";

  return gulp.src('./src/less/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 3 versions'],
      cascade: false,
      remove: true
    }))
    .pipe(minifycss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./dist/css'))
  ;
});

gulp.task('scripts', function(){
  "use strict";

  var __scriptCompileError = function(err) {
    console.error('Scripts compilation error: ', err.message, err.stack);
  };

  var
    path  = './src/js/',
    files = [
      'hashtags.utils.js',
      'hashtags.tag.js',
      'hashtags.js'
    ], i = 0, ii = files.length;

  for(;i<ii;++i) {
    files[i] = path + files[i];
  }

  var stream = gulp.src(files)
      .pipe(sourcemaps.init())
      .pipe(concat("hashtags.js"))
      //.pipe(to5())
      .pipe(esnext())
    //.pipe(closureCompiler({
    //  compilerPath: './bower_components/compiler-latest/compiler.jar',
    //  fileName: fileName
    //  ,compilerFlags: {
    //    //closure_entry_point: 'app.main',
    //    //language: 'ECMASCRIPT5_STRICT',
    //    compilation_level: 'ADVANCED_OPTIMIZATIONS'//,
    //    //define: [
    //    //  "goog.DEBUG=false"
    //    //],
    //    // Some compiler flags (like --use_types_for_optimization) don't have value. Use null.
    //    // use_types_for_optimization: null,
    //    //only_closure_dependencies: true,
    //    //output_wrapper: '(function(){%output%})();'//,
    //    //warning_level: 'VERBOSE'
    //  }
    //}).on('error', __scriptCompileError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./dist/js'))
  ;

  stream.on('error', __scriptCompileError);

  return stream;
});

gulp.task('watch', function() {
  "use strict";

  livereload.listen();
  gulp.watch('./src/less/*.less', ['styles']).on('change', livereload.changed);
  gulp.watch('./src/js/*.js', ['scripts']).on('change', livereload.changed);
});

gulp.task('default', ['scripts','styles','watch']);