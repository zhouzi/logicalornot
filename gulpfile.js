var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var browserSync = require('browser-sync')
var reload = browserSync.reload
var webpackConfig = require('./webpack.config.js')

gulp.task('styles', function () {
  return gulp
    .src('src/styles/*.scss')
    .pipe($.sass({ outputStyle: 'compressed' }))
    .pipe($.autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist'))
})

gulp.task('scripts', function () {
  return gulp
    .src('src/app/app.js')
    .pipe($.webpack(webpackConfig))
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function () {
  gulp.watch('src/styles/*.scss', ['styles'])
  gulp.watch('src/**/*.js', ['scripts'])
})

gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.']
    }
  })

  gulp.watch(['dist/*.css', 'dist/*.js', 'index.html']).on('change', reload)
  gulp.run('watch')
})

gulp.task('default', ['styles', 'scripts'])
