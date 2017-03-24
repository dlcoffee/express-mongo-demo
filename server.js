const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// middleware
app.use(bodyParser.urlencoded({
  extended: true,
}));


app.listen(8080, function() {
  console.log('listening on 8080');
});


// GETs
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// POSTs
app.post('/quotes', (req, res) => {
  console.log(req.body);
});
