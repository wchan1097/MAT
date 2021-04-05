const { body, validationResult } = require("express-validator");

module.exports = function(app){
  app.get("/signup", function (req, res, next) {
    res.render("signup");
  });
  
  app.post("/signup", body("username").matches(/^[A-Za-z]\w+/gm), body('password').isLength({ min: 5 }), function (req, res, next) {
    try{
      validationResult(req).throw();
      app.locals.users
      .findOne({username: req.body.username.toLowerCase()})
      .then(user => {
        var first = req.body.first.charAt(0).toUpperCase() + req.body.first.toLowerCase().substring(1);
        var last = req.body.last.charAt(0).toUpperCase() + req.body.last.toLowerCase().substring(1)
        if (!user){
          app.locals.users.insertOne({
            fname: first,
            lname: last,
            username: req.body.username.toLowerCase(), 
            password: req.body.password,
            animeList: [],
            mangaList: [],
            friendsList: [],
            recommendations: []
          });
          req.session.username = req.body.username.toLowerCase();
          res.redirect("dashboard");
          res.end();
        }
        else{
          req.session.flash = "User already exists."
          res.render("signup", {message: req.session.flash});
          delete req.session.flash;
          res.end();
        }
      })
    }catch (err){
      req.session.flash = "User must start with a letter."
      res.render("signup", {message: req.session.flash});
      delete req.session.flash;
      res.end();
    }
  })
}