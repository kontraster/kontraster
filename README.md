# Kontraster

Kontraster is a tool to help audit text colour contrast.

## Installation

```shell
npm install kontraster
```

If you wish to run kontraster as a CLI tool outside of a project, you may want to install kontraster globally:

```shell
npm install kontraster -g
```

## Node usage

```js
const kontraster = require('kontraster');

kontraster(baseImage, overlayImage, {
	isLargeText: false,
	level: 'AA',
	output: './output.png',
	outputType: 'overlay',
});
```

## CLI Usage

```shell
konstraster <base image> <overlay image> [options]
```

### Options

- `--is-large-text`: Whether the contents is large text (> 18 points, or > 14 points and bold)
- `--level`, `-l`: The WCAG level to test ("AA" or "AAA", defaults to AA)
- `--output`, `-o`: The path to write the output image to
- `--output-type`, `-t`: The type of output ("composition" or "mask", defaults to composition)
- `--help`, `-h`: Show the help message
