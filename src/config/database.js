var mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const config = require('./index');

//connect to db
function setupConnection() {
  mongoose.connect(config.uri, { useNewUrlParser: true, useCreateIndex: true })
  mongoose.connection.on('connected', function(){
    console.log('db connection is now open');
  });
  mongoose.connection.on('error', function(err){
    if(err){ console.log('Error in database conn', err);}    
});
}
function connect() {
  if (process.env.NODE_ENV === 'testing') {
    const mockgoose = new Mockgoose(mongoose);
    return mockgoose.prepareStorage()
      .then(() => {
        setupConnection();
      })
  } else {
    setupConnection();
  }
}

module.exports = {connect};
