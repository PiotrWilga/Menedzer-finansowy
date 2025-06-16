const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const { PORT, SESSION_SECRET } = require("./config");
const { mongoConnect } = require("./database");
const logger = require("./utils/logger");
const { STATUS_CODE } = require("./constants/statusCode");

const homeRoutes = require("./routing/home");
const userRoutes = require("./routing/user");
const accountRoutes = require("./routing/account");
const transactionsRoutes = require("./routing/transactions");
const categoryRoutes = require('./routing/category');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use((req, _res, next) => {
  const { url, method } = req;
  logger.getInfoLog(url, method);
  next();
});

app.use(userRoutes);
app.use(homeRoutes);
app.use("/accounts", accountRoutes);
app.use("/transactions", transactionsRoutes);
app.use('/categories', categoryRoutes);

app.use((req, res) => {
  const { url } = req;
  logger.getErrorLog(url);
  res.status(STATUS_CODE.NOT_FOUND).render("404", {
    headTitle: "404",
  });
});

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
  });
});
