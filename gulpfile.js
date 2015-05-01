var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var webpackConfig = require('./webpack.config.js');
var karma = require('karma').server;

gulp.task('styles', function () {
  return gulp
    .src('src/styles/*.scss')
    .pipe($.sass({ outputStyle: 'compressed' }))
    .pipe($.autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
  return gulp
    .src('src/app/app.js')
    .pipe($.webpack(webpackConfig))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
  return gulp
    .src(['src/app/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    /*.pipe($.eslint.failOnError())*/;
});

gulp.task('watch', function () {
  gulp.watch('src/styles/*.scss', ['styles']);
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch('dist/app.min.js', ['lint']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.']
    }
  });

  gulp.watch(['dist/*.css', 'dist/*.js', 'index.html']).on('change', reload);
  gulp.run('watch');
});

gulp.task('default', ['styles', 'scripts']);
