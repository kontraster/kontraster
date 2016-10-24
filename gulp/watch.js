const gulp = require('gulp');
const scripts = require('./scripts');
const browserSync = require('browser-sync').create();

function reload(done) {
  browserSync.reload();
  done();
}

module.exports = () => {
  browserSync.init({
    proxy: 'localhost:3000',
  });

  gulp.watch('src/scripts/**/*.js', gulp.series('scripts', reload));
  gulp.watch('public/assets/shaders/**/*.glsl', reload);
};
