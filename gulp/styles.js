const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const minifyCss = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');

const config = require('./config');

module.exports = () => gulp.src(`${config.paths.styles.source}/**/*.scss`)
  .pipe(sourcemaps.init())
  .pipe(sass({
    includePaths: [
      'node_modules/normalize.scss',
    ],
  }))
  .pipe(config.environment.production ? minifyCss() : util.noop())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(config.paths.styles.destination));
