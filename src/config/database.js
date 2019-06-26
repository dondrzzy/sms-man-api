var mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const config = require('./index');

//connect to db
function connect() {
  if (process.env.NODE_ENV === 'testing') {
    const mockgoose = new Mockgoose(mongoose);
    return mockgoose.prepareStorage()
      .then(() => {
        mongoose.connect(config.uri, { useNewUrlParser: true, useCreateIndex: true })
        mongoose.connection.on('connected', function(){
          console.log('db connection is now open');
        });
      })
  } else {
    mongoose.connect(config.uri, { useNewUrlParser: true, useCreateIndex: true });
    // on conn
    mongoose.connection.on('connected', function(){
        console.log('connected to database at 27017');
    });
    //incase of error in conn
    mongoose.connection.on('error', function(err){
        if(err){ console.log('Error in database conn', err);}    
    });
  }
}

function close() {
  return mongoose.disconnect();
}

module.exports = {connect, close};
