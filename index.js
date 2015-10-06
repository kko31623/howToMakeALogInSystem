// Expressjs
var express = require('express');
var app = express();
// Sessions
var session = require('express-session')
// MongoDB
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/test', ['users']);
// Body-Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json('application/json'));
// Sessions Init.
app.use(session({ secret: 'wowtoZJVxpdk5736=99', name: 'id'}));

app.use(express.static(__dirname));  

app.get('/settings', function(req, res) {
  if(!req.session.username) {
    res.redirect('/');
  } else {
    res.send('You are in the settings page.');
  }
});

app.get('/', function(req, res) {
  if(req.session.username) {
    res.send('You are already logged in. ' + req.session.username);
  } else {
    res.sendFile(__dirname + '/login.html');
  }
});

app.post('/login', function(req, res) {
  db.users.find({
    'username': req.body.username,
    'password': req.body.password
  }, function(err, docs) {
    if(!docs[0]) {
      res.send('Error: User not found.');
    } else {
      req.session.username = req.body.username;
      res.redirect('/')
    }
  });
});

app.post('/register', function(req, res) {
  db.users.find({
    'username': req.body.username
  }, function(err, docs) {
    if(docs[0]) {
      res.send('Error: User already exists.');
    } else {
      db.users.insert({
        'username': req.body.username,
        'password': req.body.password
      }, function(err, docs) {
        req.session.username = req.body.username;
        res.redirect('/');
      });
    }
  });
});

var port = 3000;
app.listen(port);
console.log('Listening on Port: ' + port);