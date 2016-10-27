const gulp = require('gulp');
const del = require('del');
const config = require('./config');

module.exports = () => del(config.paths.destination);
