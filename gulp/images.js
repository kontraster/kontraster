const gulp = require('gulp');
const minifyImage = require('gulp-imagemin');
const config = require('./config');

module.exports = () => gulp.src(`${config.paths.images.source}/**/*.{gif,jpg,png,svg}`)
  .pipe(minifyImage())
  .pipe(gulp.dest(config.paths.images.destination));
