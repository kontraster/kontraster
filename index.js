const express = require('express');
const app = express();

app.use(express.static('public'));
app.use((req, res) => res.status(404).end());

app.listen(3000, (err) => {
  console.log('Listening to http://localhost:3000');
});
