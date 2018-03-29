const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const puppeteer = require('puppeteer');
const server = require('./server');
const outputType = require('./output-type');
const wcagLevel = require('./wcag-level');

const stat = util.promisify(fs.stat);
const getImageSize = util.promisify(require('image-size'));

const optionsDefault = {
	isLargeText: false,
	level: 'AA',
	output: './output.png',
	outputType: 'overlay',
};

module.exports = async (imageBaseInput, imageTextInput, optionsUser = {}) => {
	const imageBase = path.resolve(imageBaseInput);
	const imageText = path.resolve(imageTextInput);

	if (!(await stat(imageBase)).isFile()) {
		throw new Error(`Unable to read ${imageBase}`);
	}

	if (!(await stat(imageText)).isFile()) {
		throw new Error(`Unable to read ${imageText}`);
	}

	const options = Object.assign({}, optionsDefault, optionsUser);
	const output = path.resolve(options.output);

	if (typeof options.isLargeText !== 'boolean') {
		throw new Error(`${options.isLargeText} must be set to 'true' or 'false'`);
	}

	if (!wcagLevel.isValid(options.level)) {
		throw new Error(wcagLevel.getError(options.level));
	}

	if (!outputType.isValid(options.outputType)) {
		throw new Error(outputType.getError(options.outputType));
	}

	await fs.ensureDir(path.dirname(output));

	const url = await server.start(imageBase, imageText, {
		contrastRatio: wcagLevel.getContrastRatioThreshold(options.level, options.isLargeText),
		outputType: outputType.getShaderConstant(options.outputType),
	});

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	const imageSize = await getImageSize(imageBase);

	const end = () => {
		browser.close();
		server.stop();
	};

	page.on('error', console.error);
	page.on('pageerror', console.error);

	await page.setViewport({
		height: imageSize.height,
		width: imageSize.width,
	});

	await page.goto(url);

	try {
		await page.waitForSelector('canvas');
		await page.screenshot({
			path: options.output,
			fullPage: true,
		});
	} catch (e) {
		console.error(e);
	} finally {
		end();
	}

	return options.output;
};
