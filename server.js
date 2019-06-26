// load env variables
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const port = process.env.PORT || 3000;

const app = require('./src/app');

app.listen(port, function(req, res) {
  console.log('Server started at port: ', port);
});
