var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function () {
  return gulp
    .src('src/styles/*.scss')
    .pipe($.sass({ outputStyle: 'compressed' }))
    .pipe($.autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('src/styles/*.scss', ['styles']);
});

gulp.task('serve', ['styles'], function () {
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

gulp.task('default', ['styles']);
