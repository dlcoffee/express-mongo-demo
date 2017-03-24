const express = require('express');
const app = express();

app.listen(8080, function() {
  console.log('listening on 8080');
});


// GETs
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// POSTs
app.post('/quotes', (req, res) => {
});
