const path = require('path');
const meow = require('meow');
const kontraster = require('../kontraster');

const helpMessage = `
Usage
	$ kontraster <url> [options]

Options
	-o, --output          Directory to save screenshots to
	-vh, --viewportHeight The viewport height (in pixels)
	-vw, --viewportWidth  The viewport width (in pixels)
	-m, --isMobile        Whether the browser should pretend to be a mobile
	-t, --isTouch         Whether the browser should pretend to support touch events

Examples
	$ kontraster https://example.com
		--output "~/example.com"
		--viewportWidth 1024
		--isMobile`;

const cli = meow(helpMessage, {
	alias: {
		o: 'output',
		vh: 'viewportHeight',
		vw: 'viewportWidth',
		m: 'isMobile',
		t: 'isTouch',
	},
	boolean: ['isMobile', 'isTouch'],
	string: ['output'],
	default: {
		output: './output',
		viewportHeight: 1024,
		viewportWidth: 1024,
		isMobile: false,
		isTouch: false,
	},
});

if (cli.input.length < 1) {
	console.log('No URL specified');

	cli.showHelp();
	process.exit(1);
}

const url = cli.input[0];

(async () => {
	await kontraster(url, {
		output: path.resolve(cli.flags.output),
		viewportHeight: Number.parseInt(cli.flags.viewportHeight, 10),
		viewportWidth: Number.parseInt(cli.flags.viewportWidth, 10),
		isMobile: cli.flags.isMobile,
		isTouch: cli.flags.isTouch,
	});
})();

module.exports = cli;
