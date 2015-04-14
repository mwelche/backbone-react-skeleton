var gulp = require('gulp');
var gutil = require('gulp-util');

var coffee = require('gulp-coffee');
var cjsx = require('gulp-cjsx');

var csso = require('gulp-csso');
var rework = require('gulp-rework');
var at2x = require('rework-plugin-at2x');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('coffee', function() {
  // Coffee
  return gulp.src('./dev/js/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('cjsx', function() {
  // CJSX
  return gulp.src('./dev/js/*.cjsx')
    .pipe(cjsx({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('reworkcss', function() {
  return gulp.src('./dev/css/app.css')
    .pipe(rework(at2x(), {sourcemap: true}))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('autoprefixer', ['reworkcss'], function () {
  return gulp.src('./public/css/app.css')
    .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('csso', ['autoprefixer'], function() {
  return gulp.src('./public/css/app.css')
    .pipe(csso())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('default', ['coffee', 'cjsx', 'reworkcss', 'autoprefixer', 'csso'])