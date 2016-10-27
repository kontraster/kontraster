const gulp = require('gulp');
const util = require('gulp-util');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const minifyJs = require('gulp-uglify');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const config = require('./config');

module.exports = () => {
  const b = browserify({
    debug: true,
    entries: `${config.paths.scripts.source}/app.js`,
    transform: [babelify],
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(config.environment.production ? minifyJs() : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.scripts.destination));
};
