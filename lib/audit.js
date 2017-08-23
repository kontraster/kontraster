const puppeteer = require('puppeteer');
const util = require('util');
const getImageSize = util.promisify(require('image-size'));

const sleep = require('./utils/sleep');
const server = require('./server');
const wcagLevel = require('./wcag-level');

const log = (...args) => {
	console.log(...args);
};

const error = (...args) => {
	console.error(...args);
};

module.exports = async (imageBase, imageText, options = {}) => {
	const minContrastRatio = wcagLevel.getContrastRatioThreshold(options.level, options.isLargeText);

	const url = await server.start(imageBase, imageText, minContrastRatio);
	const browser = await puppeteer.launch();
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
		.catch((err) => {
			console.error(err);
			end();
		});
};
