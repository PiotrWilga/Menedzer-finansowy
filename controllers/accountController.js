const Account = require("../models/accountModel");
const Transaction = require("../models/transactionModel");
const { ObjectId } = require("mongodb");

// GET /accounts/new — formularz tworzenia konta
exports.getCreateAccountView = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("accountForm", {
    headTitle: "Nowe konto",
    errorMessage: null,
    formAction: "/accounts/new",
    account: {
      name: "",
      description: ""
    },
    isEditMode: false
  });
};

// POST /accounts/new — tworzenie konta
exports.postCreateAccount = async (req, res) => {
  const { name, description } = req.body;

  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (!name || name.trim() === "") {
    return res.render("accountForm", {
      headTitle: "Nowe konto",
      errorMessage: "Nazwa konta jest wymagana.",
      formAction: "/accounts/new",
      account: { name, description },
      isEditMode: false
    });
  }

  try {
    await Account.create({
      userId: new ObjectId(req.session.user.id),
      name: name.trim(),
      description: description?.trim() || ""
    });

    res.redirect("/");
  } catch (err) {
    console.error("Błąd podczas tworzenia konta:", err);
    res.render("accountForm", {
      headTitle: "Nowe konto",
      errorMessage: "Wystąpił błąd przy tworzeniu konta.",
      formAction: "/accounts/new",
      account: { name, description },
      isEditMode: false
    });
  }
};

// GET /accounts/:id/edit — formularz edycji konta
exports.getEditAccountView = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const accountId = req.params.id;

  try {
    const account = await Account.findById(accountId);

    if (!account || String(account.userId) !== req.session.user.id) {
      return res.status(404).send("Nie znaleziono konta.");
    }

    res.render("accountForm", {
      headTitle: "Edycja konta",
      errorMessage: null,
      formAction: `/accounts/${accountId}/edit`,
      account,
      isEditMode: true
    });
  } catch (err) {
    console.error("Błąd podczas pobierania konta do edycji:", err);
    res.status(500).send("Wystąpił błąd serwera.");
  }
};

// POST /accounts/:id/edit — aktualizacja konta
exports.postEditAccount = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const accountId = req.params.id;
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.render("accountForm", {
      headTitle: "Edycja konta",
      errorMessage: "Nazwa konta jest wymagana.",
      formAction: `/accounts/${accountId}/edit`,
      account: { _id: accountId, name, description },
      isEditMode: true
    });
  }

  try {
    const account = await Account.findById(accountId);

    if (!account || String(account.userId) !== req.session.user.id) {
      return res.status(404).send("Nie znaleziono konta.");
    }

    await Account.updateById(accountId, {
      name: name.trim(),
      description: description?.trim() || ""
    });

    res.redirect("/");
  } catch (err) {
    console.error("Błąd podczas edycji konta:", err);
    res.render("accountForm", {
      headTitle: "Edycja konta",
      errorMessage: "Wystąpił błąd przy zapisie konta.",
      formAction: `/accounts/${accountId}/edit`,
      account: { _id: accountId, name, description },
      isEditMode: true
    });
  }
};

// POST /accounts/:id/delete — usuwanie konta
exports.postDeleteAccount = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const accountId = req.params.id;

  try {
    const account = await Account.findById(accountId);

    if (!account || String(account.userId) !== req.session.user.id) {
      return res.status(404).send("Nie znaleziono konta.");
    }

    await Transaction.deleteByAccountId(accountId);
    await Account.deleteById(accountId);

    res.redirect("/");
  } catch (err) {
    console.error("Błąd podczas usuwania konta:", err);
    res.status(500).send("Wystąpił błąd podczas usuwania konta.");
  }
};

exports.getAccountDetails = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const accountId = req.params.id;

  try {
    const account = await Account.findById(accountId);

    if (!account || String(account.userId) !== req.session.user.id) {
      return res.status(404).send("Nie znaleziono konta.");
    }

    const transactions = await Transaction.findByAccountId(accountId); // lub find({ accountId }) zależnie od modelu

    res.render("account", {
      headTitle: `Konto: ${account.name}`,
      account,
      transactions,
    });
  } catch (err) {
    console.error("Błąd podczas pobierania konta:", err);
    res.status(500).send("Błąd serwera");
  }
};