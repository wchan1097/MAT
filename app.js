const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const flash = require("connect-flash");
const { MongoClient } = require("mongodb");
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(flash());
app.use(session({
  secret: "secret",
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

MongoClient.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db("MAT");
  const users = db.collection("users");
  app.locals.users = users;
})

require("./routes/passport")(app);
require("./routes/signup")(app);
require("./routes/dashboard")(app);
app.use("/signin", require("./routes/signin"));

app.get("/", function (req, res, next) { res.render("index"); });

app.listen(process.env.DB_PORT, function () { console.log(`MAT application listening on ${process.env.DB_PORT}`); });