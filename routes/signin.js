const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("signin");
});

router.post("/", passport.authenticate("local", {failureRedirect: "/"}), function (req, res, next) {
  req.session.username = req.body.username.toLowerCase();
  res.redirect("dashboard");
})

module.exports = router;