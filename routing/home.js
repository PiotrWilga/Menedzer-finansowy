const express = require("express");
const homeController = require("../controllers/homeController");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/", isAuth, homeController.getHomeView);

module.exports = router;
