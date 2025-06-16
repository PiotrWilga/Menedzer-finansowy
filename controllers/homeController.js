const { ObjectId } = require("mongodb");
const Account = require("../models/accountModel");
const Transaction = require("../models/transactionModel");

exports.getHomeView = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const user = req.session.user;
  let accounts = [];

  try {
    const userId = new ObjectId(user.id); // zakładamy, że user.id to string
    accounts = await Account.findByUserId(userId);

    for (const account of accounts) {
      account.balance = await Transaction.getBalanceForAccount(account._id);
    }

  } catch (error) {
    console.error("Błąd przy pobieraniu kont:", error);
  }

  res.render("home", {
    headTitle: "Strona główna",
    user,
    accounts,
  });
};
