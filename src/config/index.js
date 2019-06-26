const crypto = require('crypto').randomBytes(256).toString('hex');

if (process.env.NODE_ENV === 'testing') {
	module.exports = {
    uri: process.env.TEST_DB_URI,
    secret: process.env.TEST_SECRET_KEY,
    db: process.env.TEST_DB_NAME
  }
} else {
  module.exports = {
    uri: process.env.DB_URI,
    secret: process.env.SECRET_KEY,
    db: process.env.DB_NAME
  }
}
