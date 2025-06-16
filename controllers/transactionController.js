const Transaction = require("../models/transactionModel");
const Account = require("../models/accountModel");
const Category = require("../models/categoryModel");
const categoryController = require('./categoryController');
const { ObjectId } = require("mongodb");

// Widok dodawania transakcji
exports.getNewTransactionView = async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const today = new Date().toISOString().split("T")[0];
  const accountId = req.params.accountId;
  const userId = req.session.user.id;

  let categories = [];
  try {
    categories = await categoryController.getUserCategories(new ObjectId(userId));
  } catch (err) {
    console.error("Błąd pobierania kategorii:", err);
  }

  res.render("transactionForm", {
  headTitle: "Nowa transakcja",
  formTitle: "Dodaj transakcję",
  formAction: `/transactions/new/${accountId}`,
  transaction: {},
  today,
  categories,
  errorMessage: null
});
};

// Obsługa formularza dodawania transakcji
exports.postNewTransaction = async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const accountId = req.params.accountId;
  const userId = req.session.user.id;
  const { amount, description, date, counterpart, category } = req.body;

  if (!amount || isNaN(amount)) {
    let categories = [];
    try {
      categories = await categoryController.getUserCategories(new ObjectId(userId));
    } catch (err) {
      console.error("Błąd pobierania kategorii:", err);
    }

    return res.render("newTransaction", {
      headTitle: "Nowa transakcja",
      accountId,
      errorMessage: "Podaj poprawną kwotę.",
      today: new Date().toISOString().split("T")[0],
      categories,
    });
  }

  try {
    await Transaction.create({
      accountId: new ObjectId(accountId),
      amount: parseFloat(amount),
      description: description?.trim() || "",
      date: new Date(date),
      counterpart: counterpart?.trim() || "",
      category: category?.trim() || null
    });

    res.redirect(`/accounts/${accountId}`);
  } catch (err) {
    console.error("Błąd dodawania transakcji:", err);

    let categories = [];
    try {
      categories = await categoryController.getUserCategories(new ObjectId(userId));
    } catch (err) {
      console.error("Błąd pobierania kategorii:", err);
    }

    res.render("newTransaction", {
      headTitle: "Nowa transakcja",
      accountId,
      errorMessage: "Wystąpił błąd przy dodawaniu transakcji.",
      today: new Date().toISOString().split("T")[0],
      categories,
    });
  }
};

// Usuwanie transakcji
exports.deleteTransaction = async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const transactionId = req.params.transactionId;
  const { accountId } = req.body;

  try {
    await Transaction.deleteById(transactionId);
    res.redirect(`/accounts/${accountId}`);
  } catch (err) {
    console.error("Błąd usuwania transakcji:", err);
    res.redirect(`/accounts/${accountId}`);
  }
};

exports.showEditForm = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findById(new ObjectId(transactionId));
    const categories = await Category.findByUserId(new ObjectId(req.session.user.id));
    if (!transaction) {
      return res.redirect("/dashboard?error=Nie znaleziono transakcji");
    }

    res.render("transactionForm", {
      headTitle: "Edytuj transakcję",
      formTitle: "Edytuj transakcję",
      formAction: `/transactions/edit/${transactionId}`,
      transaction,
      today: new Date().toISOString().split("T")[0],
      categories,
      errorMessage: null
    });
  } catch (err) {
    console.error("Błąd podczas pobierania transakcji:", err);
    res.redirect("/dashboard?error=Błąd podczas edycji transakcji");
  }
};

exports.updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const { date, amount, description, counterpart, category } = req.body;

  try {
    // najpierw znajdź istniejącą transakcję, żeby znać accountId
    const existingTransaction = await Transaction.findById(transactionId);
    if (!existingTransaction) {
      return res.status(404).send("Nie znaleziono transakcji.");
    }

    // zaktualizuj transakcję
    await Transaction.updateById(transactionId, {
      date: new Date(date),
      amount: parseFloat(amount),
      description,
      counterpart,
      category
    });

    // przekieruj do widoku konta
    res.redirect(`/accounts/${existingTransaction.accountId}`);
  } catch (err) {
    console.error("Błąd podczas zapisywania zmian:", err);
    res.redirect(`/transactions/edit/${transactionId}?error=Nie udało się zapisać zmian`);
  }
};
