const { getDatabase } = require("../database");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "users";

class User {
  static async create(userData) {
    const db = getDatabase();
    const result = await db.collection(COLLECTION_NAME).insertOne(userData);
    return result.insertedId;
  }

  static async findByLogin(login) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ login });
  }

  static async findById(id) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }

  static async updatePasswordById(userId, newPassword) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: newPassword } }
    );
  }

  static async deleteById(id) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;
