module.exports = function (app) {
  app.get("/dashboard", function (req, res, next) {
    if (req.session.username == null) {
      res.redirect("/");
    } else {
      app.locals.users
        .findOne({
          username: req.session.username.toLowerCase()
        })
        .then(user => {
          res.render(
            "dashboard", {
              fullName: user.fname + " " + user.lname,
              animeList: user.animeList,
              mangaList: user.mangaList
            }
          );
        })
    }
  })

  app.get("/add", function (req, res, next) {
    if (req.session.username) {
      var query = {
        username: req.session.username.toLowerCase()
      };
      var checkManga = (req.query.type == "manga");
      app.locals.users
        .findOne(query)
        .then(user => {
          var newList = checkManga ? user["mangaList"] : user["animeList"];
          var checkExists = false;
          newList.forEach(item => {
            if (item.title == req.query.media_title) {
              checkExists = true;
            }
          })
          if (checkExists == false) {
            newList.push(req.query);
            if (checkManga) {
              app.locals.users.updateOne(query, { $set: { mangaList: newList }
              }, (error, res) => {
                if (error) console.log(error); 
              })
            }
            else{
              app.locals.users.updateOne(query, { $set: { animeList: newList }
              }, (error, res) => {
                if (error) console.log(error);
              })
            }
          }
        })
    }
  })
}