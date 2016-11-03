const gulp = require('gulp');
const util = require('gulp-util');
const minifyImage = require('gulp-imagemin');
const config = require('./config');

module.exports = () => gulp.src(`${config.paths.images.source}/**/*.{gif,jpg,png,svg}`)
  .pipe(config.environment.production ? minifyImage() : util.noop())
  .pipe(gulp.dest(config.paths.images.destination));
