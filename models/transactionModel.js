const { getDatabase } = require("../database");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "transactions";

class Transaction {
  // Tworzy nową transakcję
  static async create(data) {
    const db = getDatabase();
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...data,
      category: data.category || null  // domyślnie null jeśli brak
    });
    return result.insertedId;
  }

  // Pobiera wszystkie transakcje dla danego konta
  static async findByAccountId(accountId) {
    const db = getDatabase();
    return db
      .collection(COLLECTION_NAME)
      .find({ accountId: new ObjectId(accountId) })
      .sort({ date: -1 }) // najnowsze najpierw
      .toArray();
  }

  // Znajduje jedną transakcję po ID
  static async findById(transactionId) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(transactionId) });
  }

  // Aktualizuje dane transakcji po ID
  static async updateById(transactionId, updatedData) {
    const db = getDatabase();
    const { date, amount, description, counterpart, category } = updatedData;

    return db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(transactionId) },
      {
        $set: {
          date,
          amount,
          description,
          counterpart,
          category: category || null  // Jeśli pusty string, ustaw na null
        }
      }
    );
  }

  // Usuwa wszystkie transakcje powiązane z danym kontem (np. przy usuwaniu konta)
  static async deleteByAccountId(accountId) {
    const db = getDatabase();
    return db
      .collection(COLLECTION_NAME)
      .deleteMany({ accountId: new ObjectId(accountId) });
  }

  // Usuwa konkretną transakcję po ID
  static async deleteById(transactionId) {
    const db = getDatabase();
    return db
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(transactionId) });
  }

  // Oblicza saldo konta, sumując kwoty transakcji
  static async getBalanceForAccount(accountId) {
    const db = getDatabase();

    const result = await db.collection(COLLECTION_NAME).aggregate([
      { $match: { accountId: new ObjectId(accountId) } },
      {
        $group: {
          _id: null,
          balance: { $sum: "$amount" }
        }
      }
    ]).toArray();

    return result.length > 0 ? result[0].balance : 0;
  }
}

module.exports = Transaction;
