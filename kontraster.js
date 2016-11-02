#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const express = require('express');
const handlebars = require('express-handlebars');

// Define CLI help page and available commands
const settings = require('meow')(`
Usage
  $ ./kontraster [options]

Options
  --port, -p  The port to run the server on (default: 3000)
  --help, -h  This help message

Examples
  $ ./kontraster --port=1337
`, {
  string: ['port'],
  alias: {
    help: 'h',
    port: 'p',
  },
});

// If port isn’t defined via CLI argument, use the one defined in package.json
settings.flags.port = settings.flags.port || settings.pkg.config.port;

// Initialize the HTTP server
const app = express();

// Set handlebars as view engine
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Define the app’s routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', require('./routes/index'));
app.get('/audit', require('./routes/audit'));
app.get('/get-screenshots', require('./routes/get-screenshots'));

// Define a fall-back 404 page route
app.use(require('./routes/404'));

// Start HTTP server
app.listen(settings.flags.port, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening to:', chalk.magenta(`http://localhost:${settings.flags.port}`));
});
