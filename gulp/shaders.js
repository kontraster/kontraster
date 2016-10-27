const gulp = require('gulp');
const config = require('./config');

module.exports = () => gulp.src(`${config.paths.shaders.source}/**/*.glsl`)
    .pipe(gulp.dest(config.paths.shaders.destination));
