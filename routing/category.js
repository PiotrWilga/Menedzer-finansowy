const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const isAuth = require("../middleware/isAuth");

router.post("/add", isAuth, categoryController.createCategory);
router.post("/delete", isAuth, categoryController.deleteCategory);

module.exports = router;
