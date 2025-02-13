require('dotenv').config();

if (!process.env.JWT_SECRET) {
    throw new Error("Unable to load JWT_SECRET from .env file");
}

module.exports = process.env;
