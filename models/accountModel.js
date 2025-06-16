const { getDatabase } = require("../database");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "accounts";

class Account {
  static async create(accountData) {
    const db = getDatabase();
    const result = await db.collection(COLLECTION_NAME).insertOne(accountData);
    return result.insertedId;
  }

  static async findByUserId(userId) {
    const db = getDatabase();
    return db
      .collection(COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  static async findById(accountId) {
    const db = getDatabase();
    return db
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(accountId) });
  }

  static async updateById(accountId, updateData) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(accountId) },
      { $set: updateData }
    );
  }

  static async deleteById(accountId) {
    const db = getDatabase();
    return db
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(accountId) });
  }
}

module.exports = Account;
