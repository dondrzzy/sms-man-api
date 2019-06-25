var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// config
const config = require('./config');

// routes
const contactsRouter = require('./routes/contactRoutes');
const messageRouter = require('./routes/messageRoutes');

var app = express();

//connect to db
mongoose.connect(config.uri);
// on conn
mongoose.connection.on('connected', function(){
    console.log('connected to database at 27017');
});
//incase of error in conn
mongoose.connection.on('error', function(err){
    if(err){ console.log('Error in database conn', err);}    
});

// add middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false 
}));

app.use('/api/v1/contacts', contactsRouter);

app.use(function(req, res, next){
  const token = req.headers['token-x'];
  if(!token){
      res.status(400).json({error:'No token provided'});
  }else{
    jwt.verify(token, config.secret, function(err, decoded){
      if (err) {
        res.status(400).json({token: false, error:'token Invalid: '+err});}
      else{
        req.decoded = decoded;
        console.log('decoded: ', decoded);
        next(); 
      }
    });
  }
});
app.use('/api/v1/messages', messageRouter);

module.exports = app;
