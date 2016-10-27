const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const config = require('./config');

function reload(done) {
  browserSync.reload();
  done();
}

module.exports = () => {
  browserSync.init({
    proxy: 'localhost:3000',
  });

  gulp.watch(`${config.paths.scripts.source}/**/*.js`, gulp.series('scripts', reload));
  gulp.watch(`${config.paths.shaders.source}/**/*.glsl`, gulp.series('shaders', reload));
  gulp.watch(`${config.paths.styles.source}/**/*.scss`, gulp.series('styles', reload));
};
