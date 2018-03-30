const fs = require('fs-extra');
const util = require('util');

const stat = util.promisify(fs.stat);

module.exports = async file => (await stat(file)).isFile();
