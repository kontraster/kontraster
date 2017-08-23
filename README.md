# Kontraster

Kontraster is a CLI tool to help audit text colour contrast.

## Prerequisites

- [Node.js and npm](https://nodejs.org/)

## Installation

To install kontraster, execute the following lines in terminal:

```shell
npm install kontraster -g
```

## Usage

```shell
$ konstraster <base image> <overlay image> [options]
```

### Options

- `--is-large-text`: Whether the contents is large text (> 18 points, or > 14 points and bold)
- `--level`, `-l`: The WCAG level to test ("AA" or "AAA", defaults to AA)
- `--output`, `-o`: The path to write the output image to
- `--output-type`, `-t`: The type of output ("composition" or "mask", defaults to composition)
- `--help`, `-h`: Show the help message
