var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var livereload = require('gulp-livereload');

var coffee = require('gulp-coffee');
var cjsx = require('gulp-cjsx');

var csso = require('gulp-csso');
var rework = require('gulp-rework');
var at2x = require('rework-plugin-at2x');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('copy', function() {
  // JS and HTML
  // (NEEDS TO BE UPDATED FOR PROD BUILD)
  return gulp.src(['./dev/**/*.js', './dev/*.html'], {
    base: './dev/'
  }).pipe(gulp.dest('./public'));
});

gulp.task('coffee', function() {
  // Coffee
  return gulp.src('./dev/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('cjsx', function() {
  // CJSX
  return gulp.src('./dev/**/*.cjsx')
    .pipe(cjsx({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('reworkcss', function() {
  // Compile rework to css
  return gulp.src('./dev/css/app.css')
    .pipe(rework(at2x(), {sourcemap: true}))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('autoprefixer', ['reworkcss'], function () {
  // Autoprefix compiled CSS
  return gulp.src('./public/css/app.css')
    .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('csso', ['autoprefixer'], function() {
  // Optimize/minify CSS
  return gulp.src('./public/css/app.css')
    .pipe(csso())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('clean', function(cb) {
  del(['public/'], cb);
});

gulp.task('watch', function() {
  // Watch js and html (TASK NEEDS TO BE UPDATED FOR PROD BUILD)
  gulp.watch(['./dev/**/*.js', './dev/*.html'], ['copy']);

  // Watch Coffeescript changes
  gulp.watch('./dev/**/*.coffee', ['coffee']);

  // Watch CoffeeJSX changes
  gulp.watch('./dev/**/*.cjsx', ['cjsx']);

  // Watch CSS changes
  gulp.watch('./dev/css/**/*.css', ['csso']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in public/, reload on change
  gulp.watch(['public/**']).on('change', livereload.changed);
});

gulp.task('default', ['clean'], function() {
  gulp.start('copy', 'coffee', 'cjsx', 'csso');
});