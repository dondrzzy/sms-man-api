const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: process.env.DB_URI,
    secret: process.env.SECRET_KEY,
    db: process.env.DB_NAME
}