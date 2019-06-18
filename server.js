var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

// add middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false 
}));

const port = 3000;

app.use('/', (req, res) => {
  res.send('SMS Management API');
});

app.listen(port, function(req, res) {
  console.log('Server started at port: ', port);
});
