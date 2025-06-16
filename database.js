const { DB_URI } = require("./config");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let database;

const mongoConnect = (callback) => {
  MongoClient.connect(DB_URI)
    .then((client) => {
      console.log("Connected!");
      database = client.db("Menedzer-finansowy");
      callback();
    })
    .catch((error) => console.log("Błąd połączenia z MongoDB:", error));
};

const getDatabase = () => {
  if (!database) {
    throw "No database found!";
  }

  return database;
};

module.exports = { mongoConnect, getDatabase };
