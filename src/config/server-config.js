const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    CLIENT_URL: process.env.CLIENT_URL
}