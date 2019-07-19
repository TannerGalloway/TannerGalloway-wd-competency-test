var express = require("express");
var router = express.Router();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./db/newsApp.db");

router.get("/", (req, res) => {
    
      var articleList = [];
        db.all("SELECT category FROM articles GROUP BY category", (err, categories) => {
            if(err){
                console.log(err.message);
            }

            
            categories.map((articleInfo) => {
                db.all("SELECT user_id, title, category FROM articles WHERE category = ? LIMIT 3", [articleInfo.category], (err, articles) => {
                    if(err){
                        console.log(err.message);
                    }

                    articleList.push(articles);
                // console.log(articleList);
                });
            });
            // console.log(articleList);
        });
    res.render("index");
  });

  router.get("/articles", (req, res) => {
    res.render("articlesList");
  });

  router.get("/article/:article", (req, res) => {
    res.render("article");
  });

  router.get("/login", (req, res) => {
      res.render("accountAuth", {formtype: 'Login', placeholderUsername: "Enter-Username", placeholderPassword: "Enter-Password"});
  });
    
  router.get("/signup", (req, res) => {
        res.render("accountAuth", {formtype: 'Sign Up', placeholderUsername: "Create-Username", placeholderPassword: "Create-Password"});
  });

  module.exports = router;