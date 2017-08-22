const puppeteer = require('puppeteer');
const server = require('./server');

module.exports = async (imageBase, imageText, options = {}) => {
	const url = await server.start(imageBase, imageText);
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	page.on('console', (...args) => console.log(...args));
	page.on('error', (...args) => console.error(...args));

	try {
		await page.goto(url);
		await page.screenshot({
			path: options.output,
			fullPage: true,
		});
	} catch (e) {
		console.error(e);
	}

	browser.close();
	server.stop();
};
