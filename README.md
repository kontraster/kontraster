# Kontraster

Kontraster is a tool to help audit text colour contrast on websites.

![Screenshot of Kontraster](docs/screenshot.jpg)

## Prerequisites

- [Node.js](https://nodejs.org/)

## Installation

To install Kontraster, execute the following lines in terminal:

```shell
# Download Kontraster
git clone https://github.com/timseverien/kontraster.git
cd kontraster

# Install dependencies
npm install
# Build required assets
npm run build --production

# Start server
./kontraster.js
```

After starting the server by executing `./kontraster.js`, a localhost address should appear in the console. Open that address in the browser. The rest should be self-explanatory.

## CLI Usage

```shell
$ ./kontraster [options]
```

### Options

- `--port`, `-p`: The port to run the server on (default: 3000)
- `--help`, `-h`: The help message
