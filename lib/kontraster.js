const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const getImageSize = util.promisify(require('image-size'));
const puppeteer = require('puppeteer');

const CompareImageServer = require('./servers/compare-image');
const ImageAuditOptions = require('./options/image-audit');

const PATH_PUBLIC = path.resolve(__dirname, 'web', 'compare-image');

module.exports = {
	async auditImages(userOptions) {
		const options = new ImageAuditOptions(userOptions);

		await fs.ensureDir(path.dirname(options.output));

		const server = new CompareImageServer(
			PATH_PUBLIC,
			options.imageBase,
			options.imageText,
			options.getUniforms(),
		);

		await server.start();

		const browser = await puppeteer.launch();

		try {
			const page = await browser.newPage();
			const imageSize = await getImageSize(options.imageBase);

			page.on('error', console.error);
			page.on('pageerror', console.error);

			await page.setViewport({
				height: imageSize.height,
				width: imageSize.width,
			});

			await page.goto(server.getUrl());
			await page.waitForSelector('canvas');
			await page.screenshot({
				path: options.output,
				fullPage: true,
			});
		} catch (e) {
			throw e;
		} finally {
			browser.close();
			server.stop();
		}

		return options.output;
	},
};
