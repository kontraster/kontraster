#! /usr/local/bin/node

const meow = require('meow');
const Kontraster = require('../kontraster');

const helpMessage = `
Usage
  $ kontraster <base image> <overlay image> [options]

Options
  -h, --help         This help message
  --is-large-text    Whether the contents is large text (> 18 points, or > 14 points and bold)
  -l, --level        The WCAG level to test ("AA" or "AAA", defaults to AA)
  -o, --output       The path to write the output image to
  -t, --output-type  The type of output ("composition" or "mask", defaults to composition)

Examples
  $ kontraster "~/base.png" "~/with-text.png"
  $ kontraster "~/base.png" "~/with-text.png" --is-large-text
  $ kontraster "~/base.png" "~/with-text.png" --level AAA
  $ kontraster "~/base.png" "~/with-text.png" --output-type mask
`;

const cli = meow(helpMessage, {
	flags: {
		help: {
			alias: 'h',
		},
		isLargeText: {
			type: 'boolean',
		},
		level: {
			alias: 'l',
			type: 'string',
		},
		output: {
			alias: 'o',
			type: 'string',
		},
		outputType: {
			alias: 't',
			type: 'string',
		},
	},
});

if (cli.input.length !== 2) {
	console.error('Please specifiy two images');

	cli.showHelp();
	process.exit(1);
}

(async () => {
	let exitCode = 0;

	try {
		const output = await Kontraster.auditImages(Object.assign({
			imageBase: cli.input[0],
			imageText: cli.input[1],
		}, cli.flags));

		console.log(`Image saved to "${output}".`);
	} catch (e) {
		console.error(e);
		cli.showHelp();

		exitCode = 1;
	}

	process.exit(exitCode);
})();

module.exports = cli;
