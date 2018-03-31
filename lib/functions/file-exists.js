const fs = require('fs-extra');
const util = require('util');

const stat = util.promisify(fs.stat);

module.exports = async (file) => {
	try {
		const result = await stat(file);
		return result.isFile();
	} catch (e) {
		return false;
	}
};
