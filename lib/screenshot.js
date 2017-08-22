const puppeteer = require('puppeteer');

module.exports = async (url, options) => {
	await puppeteer.launch().then(async (browser) => {
		const page = await browser.newPage();

		await page.goto(url);
		await page.setViewport({
			height: options.viewportHeight,
			width: options.viewportWidth,
			isMobile: options.isMobile,
			hasTouch: options.isTouch,
		});

		await page.screenshot({
			path: options.files.default,
			fullPage: true,
		});
		await page.screenshot({
			path: options.files.withoutHeadings,
			fullPage: true,
		});
		await page.screenshot({
			path: options.files.withoutText,
			fullPage: true,
		});

		browser.close();
	});
};
