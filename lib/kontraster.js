const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const puppeteer = require('puppeteer');

const CompareImageServer = require('./servers/compare-image');
const fileExists = require('./functions/file-exists');
const outputType = require('./output-type');
const wcagLevel = require('./wcag-level');

const getImageSize = util.promisify(require('image-size'));

const PATH_PUBLIC = path.resolve(__dirname, 'web', 'compare-image');

module.exports = {
	async auditImages(imageBase, imageText, optionsUser = {}) {
		if (!fileExists(imageBase)) {
			throw new Error(`Unable to read ${imageBase}`);
		}

		if (!fileExists(imageText)) {
			throw new Error(`Unable to read ${imageText}`);
		}

		const options = this.validateImageOptions(Object.assign({}, {
			isLargeText: false,
			level: 'AA',
			output: './output.png',
			outputType: 'overlay',
		}, optionsUser));

		await fs.ensureDir(path.dirname(path.resolve(options.output)));

		const server = new CompareImageServer(PATH_PUBLIC, imageBase, imageText, {
			contrastRatio: wcagLevel.getContrastRatioThreshold(options.level, options.isLargeText),
			outputType: outputType.getShaderConstant(options.outputType),
		});

		await server.start();

		const browser = await puppeteer.launch();

		try {
			const page = await browser.newPage();
			const imageSize = await getImageSize(imageBase);

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

	validateImageOptions(options) {
		if (typeof options.isLargeText !== 'boolean') {
			throw new Error(`${options.isLargeText} must be set to 'true' or 'false'`);
		}

		if (!wcagLevel.isValid(options.level)) {
			throw new Error(wcagLevel.getError(options.level));
		}

		if (!outputType.isValid(options.outputType)) {
			throw new Error(outputType.getError(options.outputType));
		}

		return options;
	},
};
