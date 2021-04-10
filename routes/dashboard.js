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
            var newTitle = req.query.title.split(" ").map((item) => {
              return item.charAt(0).toUpperCase() + item.substring(1).toLowerCase();
            }).join(" ");
            req.query.title = newTitle;
            newList.push(req.query);
            app.locals.users.updateOne(query, { $set: { [(checkManga) ? "mangaList" : "animeList"]: newList }
            }, (error, res) => {
              if (error) console.log(error); 
            })
          }
        })
    }
  })

  app.get("/remove", function (req, res, next) {
    if (req.session.username){
      var query = {
        username: req.session.username.toLowerCase()
      };
      app.locals.users
      .findOne(query)
      .then(user => {
        var index = 0;
        var newList = (req.query.type == "anime") ? user["animeList"] : user["mangaList"];
        for (var i = 0; i < newList.length; i ++){
          if (newList[i].title == req.query.title){
            index = i;
          }
        }
        newList.splice(index, 1);
        app.locals.users.updateOne(query, { $set: { [(req.query.type == "anime") ? "animeList" : "mangaList"]: newList }
        }, (error, res) => {
          if (error) console.log(error); 
        })
      })
    }
  })
}