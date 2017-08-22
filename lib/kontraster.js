const fs = require('fs-extra');
const path = require('path');

const getScreenshots = require('./screenshot');
const getAudit = require('./audit');

const directoryTemporary = require('os').tmpdir();

module.exports = async (url, options = {}) => {
	const now = Date.now();
	const screenshots = {
		default: path.join(directoryTemporary, `${now}-default.png`),
		withoutText: path.join(directoryTemporary, `${now}-wo-text.png`),
		withoutHeadings: path.join(directoryTemporary, `${now}-wo-headings.png`),
	};

	await getScreenshots(url, Object.assign({}, options, { files: screenshots }));
	await getAudit(screenshots);

	// Clean up
	await fs.remove(screenshots.default);
	await fs.remove(screenshots.withoutHeadings);
	await fs.remove(screenshots.withoutText);

	// TODO: Replace this with output file
	return screenshots;
};
