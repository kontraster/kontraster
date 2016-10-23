const path = require('path');
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', require('./routes/index'));
app.post('/validate', require('./routes/validate'));
app.use(require('./routes/404'));

app.listen(3000, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening to http://localhost:3000');
});
