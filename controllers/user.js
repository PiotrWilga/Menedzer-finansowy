const bcrypt = require("bcryptjs"); // lub 'bcrypt' – zależnie co zainstalujesz
const { ObjectId } = require("mongodb");
const User = require("../models/userModel");
const categoryController = require('./categoryController');

// Widok logowania
exports.getLoginView = (req, res) => {
  res.render("login", {
    headTitle: "Logowanie",
    path: "/login",
    errorMessage: null,
  });
};

// Logowanie użytkownika
exports.postLogin = async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findByLogin(login);
  if (!user) {
    return res.render("login", {
      headTitle: "Logowanie",
      path: "/login",
      errorMessage: "Nieprawidłowy login lub hasło",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.render("login", {
      headTitle: "Logowanie",
      path: "/login",
      errorMessage: "Nieprawidłowy login lub hasło",
    });
  }

  req.session.user = {
    id: user._id,
    login: user.login,
  };

  res.redirect("/");
};

// Widok rejestracji
exports.getRegisterView = (req, res) => {
  res.render("register", {
    headTitle: "Rejestracja",
    path: "/register",
    errorMessage: null,
  });
};

// Rejestracja użytkownika
exports.postRegister = async (req, res) => {
  const { login, password } = req.body;

  const existingUser = await User.findByLogin(login);
  if (existingUser) {
    return res.render("register", {
      headTitle: "Rejestracja",
      path: "/register",
      errorMessage: "Użytkownik o tym loginie już istnieje.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({ login, password: hashedPassword });

  res.redirect("/login");
};

// Wylogowanie użytkownika
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
};

// Widok ustawień
exports.getSettingsView = async (req, res) => {
  const userId = req.session.user.id;

  let categories = [];
  try {
    categories = await categoryController.getUserCategories(new ObjectId(userId));
  } catch (err) {
    console.error("Błąd przy pobieraniu kategorii użytkownika:", err);
  }

  res.render("settings", {
    headTitle: "Ustawienia konta",
    path: "/settings",
    errorMessage: req.query.error || null,
    successMessage: req.query.success || null,
    categories,
  });
};

// Zmiana hasła
exports.postChangePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.session.user.id);

  if (!user) {
    return res.redirect("/login");
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return res.render("settings", {
      headTitle: "Ustawienia konta",
      path: "/settings",
      errorMessage: "Obecne hasło jest nieprawidłowe.",
      successMessage: null,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.render("settings", {
      headTitle: "Ustawienia konta",
      path: "/settings",
      errorMessage: "Nowe hasła nie są identyczne.",
      successMessage: null,
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.updatePasswordById(req.session.user.id, hashedPassword);

  res.render("settings", {
    headTitle: "Ustawienia konta",
    path: "/settings",
    errorMessage: null,
    successMessage: "Hasło zostało pomyślnie zmienione.",
  });
};

// Usunięcie konta
exports.deleteAccount = async (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.redirect("/login");
  }

  try {
    await User.deleteById(userId); // metoda z modelu
    req.session.destroy(err => {
      if (err) {
        console.error(err);
      }
      res.redirect("/login");
    });
  } catch (err) {
    console.error(err);
    res.render("settings", {
      headTitle: "Ustawienia konta",
      path: "/settings",
      errorMessage: "Nie udało się usunąć konta.",
      successMessage: null,
    });
  }
};
