const { getDatabase } = require("../database");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "categories";

class Category {
  static async create(data) {
    const db = getDatabase();
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...data,
      userId: new ObjectId(data.userId)
    });
    return result.insertedId;
  }

  static async findByUserId(userId) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  static async updateById(categoryId, updateData) {
    const db = getDatabase();

    // Upewniamy się, że userId nie zostanie przypadkiem przesłany jako string
    if (updateData.userId) {
      updateData.userId = new ObjectId(updateData.userId);
    }

    return db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: updateData }
    );
  }

  static async deleteById(categoryId) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(categoryId) });
  }
}

module.exports = Category;
