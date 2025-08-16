require("dotenv").config();

const PORT = Number(process.env.PORT);
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const SECRET = process.env.SECRET;
const SESSION_TIMEOUT = Number(process.env.SESSION_TIMEOUT);

module.exports = {MONGODB_URI, PORT, NODE_ENV, SECRET, SESSION_TIMEOUT};