const util = require('gulp-util');

const DIR_SOURCE = 'src';
const DIR_DESTINATION = 'public/assets';

module.exports = {
  environment: {
    production: !!util.env.production,
  },

  paths: {
    destination: DIR_DESTINATION,
    images: {
      source: `${DIR_SOURCE}/images`,
      destination: `${DIR_DESTINATION}/images`,
    },
    scripts: {
      source: `${DIR_SOURCE}/scripts`,
      destination: `${DIR_DESTINATION}/scripts`,
    },
    shaders: {
      source: `${DIR_SOURCE}/shaders`,
      destination: `${DIR_DESTINATION}/shaders`,
    },
    styles: {
      source: `${DIR_SOURCE}/styles`,
      destination: `${DIR_DESTINATION}/styles`,
    },
  },
};
