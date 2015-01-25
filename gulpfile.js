/**
 * Created by inemiro on 1/13/15.
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var livereload = require('gulp-reload');

gulp.task('css', function() {
    return gulp.src('./src/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers : ['> 1%', 'last 3 versions'],
            cascade : false,
            remove : true
        }))
        .pipe(minifycss())
        .pipe(rename({
            suffix : '.min',
            extname : '.css'
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload())
    ;
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./src/*.less', ['css']);
});

gulp.task('default', ['css'], function() {
    // place code for your default task here
});