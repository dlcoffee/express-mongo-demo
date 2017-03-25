const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();

// set templating engine
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());
app.use(express.static('public'));


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
  var cursor = db.collection('quotes')
    .find()
    .toArray((err, result) => {
      if (err) {
        return console.log(err)
      }

      res.render('index.ejs', { quotes: result });
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

//PUTs
app.put('/quotes', (req, res) => {
  var query = { name: 'Gandalf' };
  var update = {
    $set: {
      name: req.body.name,
      quote: req.body.quote,
    },
  };
  var options = {
    _id: -1,
    upsert: true,
  }; // search starting from newest entry
  var callback = (err, result) => {
    if (err) {
      return res.send(err);
    }
    res.send(result);
  };

  db.collection('quotes')
    .findOneAndUpdate(query, update, options, callback);
});

// DELETEs
app.delete('/quotes', (req, res) => {
  var query = { name: req.body.name };
  var options = {};
  var callback = (err, result) => {
    if (err) {
      return res.send(500, err);
    }
    res.send('A Saudron quote got deleted');
  };

  db.collection('quotes')
    .findOneAndDelete(query, options, callback);
});
