const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const puppeteer = require('puppeteer');
const sleep = require('./utils/sleep');
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

const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);

module.exports = async (imageBaseInput, imageTextInput, optionsUser = {}) => {
	const imageBase = path.resolve(imageBaseInput);
	const imageBaseStat = await stat(imageBase);
	const imageText = path.resolve(imageTextInput);
	const imageTextStat = await stat(imageText);

	if (!imageBaseStat.isFile()) {
		return Promise.reject(`Unable to read ${imageBase}`);
	}

	if (!imageTextStat.isFile()) {
		return Promise.reject(`Unable to read ${imageText}`);
	}

	const options = Object.assign({}, optionsDefault, optionsUser);
	const output = path.resolve(options.output);

	if (typeof options.isLargeText !== 'boolean') {
		return Promise.reject(new Error(`${options.isLargeText} must be set to 'true' or 'false'`));
	}

	if (!wcagLevel.isValid(options.level)) {
		return Promise.reject(new Error(wcagLevel.getError(options.level)));
	}

	if (!outputType.isValid(options.outputType)) {
		return Promise.reject(new Error(outputType.getError(options.outputType)));
	}

	await fs.ensureDir(path.dirname(output));

	const url = await server.start(imageBase, imageText, {
		contrastRatio: wcagLevel.getContrastRatioThreshold(options.level, options.isLargeText),
		outputType: outputType.getShaderConstant(options.outputType),
	});

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	const imageSize = await getImageSize(imageBase);
	const screenshotOptions = {
		path: options.output,
		fullPage: true,
	};

	const end = () => {
		browser.close();
		server.stop();
	};

	page.on('console', log);
	page.on('error', error);
	page.on('pageerror', error);

	await page.setViewport({
		height: imageSize.height,
		width: imageSize.width,
	});
	await page.goto(url);

	return page.waitForSelector('canvas')
		.then(() => sleep(3000))
		.then(() => page.screenshot(screenshotOptions))
		.then(end)
		.then(() => options.output)
		.catch((err) => {
			console.error(err);
			end();
		});
};
