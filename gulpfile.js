const gulp = require('gulp');
const scripts = require('./gulp/scripts');
const watch = require('./gulp/watch');

gulp.task('scripts', scripts);
gulp.task('default', gulp.parallel('scripts'));

gulp.task('watch', gulp.series('default', watch));
