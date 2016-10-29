#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const express = require('express');
const handlebars = require('express-handlebars');

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

settings.flags.port = settings.flags.port || settings.pkg.config.port;

const app = express();
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', require('./routes/index'));
app.get('/validate', require('./routes/validate'));
app.get('/get-screenshots', require('./routes/get-screenshots'));

app.use(require('./routes/404'));

app.listen(settings.flags.port, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening to:', chalk.magenta(`http://localhost:${settings.flags.port}`));
});
