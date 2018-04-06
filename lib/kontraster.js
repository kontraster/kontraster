const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const getImageSize = util.promisify(require('image-size'));

const screenshotPage = require('./functions/screenshot-page');
const ImageAuditOptions = require('./options/image-audit');
const CompareImageServer = require('./servers/compare-image');

const PATH_PUBLIC = path.resolve(__dirname, 'web', 'compare-image');

module.exports = {
	async auditImages(userOptions) {
		const options = new ImageAuditOptions(userOptions);
		const imageSize = await getImageSize(options.imageBase);
		const server = new CompareImageServer(
			PATH_PUBLIC,
			options.imageBase,
			options.imageText,
			options.getUniforms(),
		);

		try {
			await server.start();
			await fs.ensureDir(path.dirname(options.output));
			await screenshotPage(server.getUrl(), options.output, imageSize.width, imageSize.height);
		} catch (e) {
			console.error(e);
		} finally {
			server.stop();
		}

		return options.output;
	},
};
