const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const stat = util.promisify(fs.stat);

const meow = require('meow');
const wcagLevel = require('../wcag-level');
const audit = require('../audit');

const helpMessage = `
Usage
	$ kontraster <base image> <overlay image> [options]

Options
  -o, --output     The path to write the file to
  -l, --level      The WCAG level to test (AA or AAA, defaults to AA)
	--is-large-text  Whether the contents is large text (> 18 points, or > 14 points and bold)

Examples
	$ kontraster "~/base.png" "~/with-text.png"
	$ kontraster "~/base.png" "~/with-text.png" --level AAA
	$ kontraster "~/base.png" "~/with-text.png" --is-large-text
`;

const cli = meow(helpMessage, {
	alias: {
		l: 'level',
	},
	boolean: ['isHeading'],
	string: ['level', 'output'],
	default: {
		level: 'AA',
		output: './color-contrast.png',
		isLargeText: false,
	},
});

if (cli.input.length !== 2) {
	console.error('Please specifiy two images');

	cli.showHelp();
	process.exit(1);
}

if (!wcagLevel.isValid(cli.flags.level)) {
	console.error(`${cli.flags.level} is not a valid WCAG level`);

	cli.showHelp();
	process.exit(1);
}

(async () => {
	const { level, isLargeText } = cli.flags;

	const imageBase = path.resolve(cli.input[0]);
	const imageBaseStat = await stat(imageBase);

	if (!imageBaseStat.isFile()) {
		throw new Error(`Unable to read ${imageBase}`);
	}

	const imageText = path.resolve(cli.input[1]);
	const imageTextStat = await stat(imageText);

	if (!imageTextStat.isFile()) {
		throw new Error(`Unable to read ${imageText}`);
	}

	const output = path.resolve(cli.flags.output);
	const outputDirectory = fs.ensureDir(path.dirname(output));

	audit(imageBase, imageText, {
		output,
		level,
		isLargeText,
	});
})();

module.exports = cli;
