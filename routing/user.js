const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// Widok logowania
router.get("/login", userController.getLoginView);

// Obsługa logowania (POST)
router.post("/login", userController.postLogin);

// Widok rejestracji
router.get("/register", userController.getRegisterView);

// Obsługa rejestracji (POST)
router.post("/register", userController.postRegister);

// Wylogowanie użytkownika
router.get("/logout", userController.logout);

router.get("/settings", isAuth, userController.getSettingsView);
router.post("/change-password", isAuth, userController.postChangePassword);

router.post('/delete-account', isAuth, userController.deleteAccount);


module.exports = router;
