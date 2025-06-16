require("dotenv").config();

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const DB_URI = process.env.DB_URI;

module.exports = { PORT, SESSION_SECRET, DB_URI };
