const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/new/:accountId", transactionController.getNewTransactionView);
router.post("/new/:accountId", transactionController.postNewTransaction);
router.post("/delete/:transactionId", transactionController.deleteTransaction);


// Pokazanie formularza edycji
router.get("/edit/:id", transactionController.showEditForm);

// Zapisanie zmian
router.post("/edit/:id", transactionController.updateTransaction);

module.exports = router;
