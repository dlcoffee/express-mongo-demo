const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();

// middleware
app.use(bodyParser.urlencoded({
  extended: true,
}));

// mongoDB setup
var db;
MongoClient.connect(
  'mongodb://' +
  dotenv.parsed.DB_USER + ':' + dotenv.parsed.DB_PASSWORD +
  '@ds141410.mlab.com:41410/lotr-quotes',
  (err, database) => {
    if (err) {
      return console.log(err);
    }

    db = database;
    app.listen(8080, function() {
      console.log('listening on 8080');
    });
  }
);


// GETs
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  var cursor = db.collection('quotes')
    .find()
    .toArray((err, results) => {
      console.log(results);
    });
});

// POSTs
app.post('/quotes', (req, res) => {
  db.collection('quotes')
    .save(req.body, (err, result) => {
      if (err) {
        return console.log(err);
      }

      console.log('saved to the database');
      res.redirect('/');
    });
});
