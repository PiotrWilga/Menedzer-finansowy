const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.get("/new", accountController.getCreateAccountView);
router.post("/new", accountController.postCreateAccount);
router.get("/:id/edit", accountController.getEditAccountView);
router.post("/:id/edit", accountController.postEditAccount);
router.post("/:id/delete", accountController.postDeleteAccount);
router.get("/:id", accountController.getAccountDetails);

module.exports = router;
