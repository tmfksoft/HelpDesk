const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./static/sass/style.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./static/css'));
  });
   
  gulp.task('sass:watch', function () {
    gulp.watch('./static/sass/**/*.scss', gulp.series('sass'));
  });