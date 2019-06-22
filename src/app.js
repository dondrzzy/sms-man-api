var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
const config = require('./config');

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

app.get('/', (req, res) => {
  res.send('Welcome');
});

module.exports = app;
