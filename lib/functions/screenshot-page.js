const puppeteer = require('puppeteer');

const optionsDefault = {
	height: 512,
	width: 512,
};

module.exports = async (url, output, optionsUser = {}) => {
	const options = Object.assign({}, optionsDefault, optionsUser);
	const browser = await puppeteer.launch();

	try {
		const page = await browser.newPage();

		await page.setViewport(options);
		await page.goto(url);
		await page.waitForSelector('canvas');
		await page.screenshot({
			path: output,
			fullPage: true,
		});
	} catch (e) {
		throw e;
	} finally {
		browser.close();
	}
};
