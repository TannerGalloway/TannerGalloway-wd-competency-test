var express = require("express");
var router = express.Router();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./db/newsApp.db");


router.get("/", (req, res) => {
  var {role}  = req.session;
  var renderObj = {
    homeClass: "active",
    vanilla: false,
    navEditor: false,
    categories: [],
    articles: []
  };

  if(role === "Vanilla"){
    renderObj.vanilla = true;
  }else if(role === "Editor"){
    renderObj.navEditor = true;
  }
  db.all("SELECT category FROM articles GROUP BY category", (err, categories) => {
      if(err){
          console.log(err.message);
      }
      categories.map((articleInfo) => {
          renderObj.categories.push(articleInfo);
          db.all("SELECT user_id, title, category FROM articles WHERE category = ? LIMIT 3", [articleInfo.category], (err, articles) => {
              if(err){
                  console.log(err.message);
              }

          });
      });
  });
  res.render("index", renderObj);
});

router.get("/articles", (req, res) => {
  var {role}  = req.session;

  var renderObj = {
    articlesClass: "active",
    vanilla: false,
    navEditor: false
  };

  if(role === "Vanilla"){
    renderObj.vanilla = true;
  }else if(role === "Editor"){
    renderObj.navEditor = true;
  }

  res.render("articlesList", renderObj);
});

router.get("/article/:article", (req, res) => {
  var {userId, role}  = req.session;

  var renderObj = {
    articlesClass: "active",
    vanilla: false,
    navEditor: false
  };

  if(role === "Vanilla"){
    renderObj.vanilla = true;
  }else if(role === "Editor"){
    renderObj.navEditor = true;
  }

  userId ? res.render("article", renderObj): res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Login",
    signup: false,
    placeholderUsername: "Enter_Username",
    placeholderPassword: "Enter_Password"
  });
});

router.get("/signup", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Sign Up",
    signup: true,
    placeholderUsername: "Create_Username",
    placeholderPassword: "Create_Password"
  });
});

router.get("/posts", (req, res) => {
  var {role}  = req.session;

  var renderObj = {
    articlesClass: "active",
    navEditor: false,
    editor: false,
    vanilla: false
  };
 
  if(role === "Vanilla"){
    renderObj.vanilla = true;
  }else if(role === "Editor"){
    renderObj.navEditor = true;
    renderObj.editor = true;
  }
  
  res.render("articlesList", renderObj);
});

router.get("/create", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Create Article",
    navEditor: true,
    editor: true,
    placeholderTitle: "Enter_article_title",
    placeholderCatagory: "Enter_article_category"
  });
});

router.post("/signup", (req, res) => {
  var { username, password, role } = req.body;

  // get all users
  db.all("SELECT * FROM users", (err, users) => {
    if (err) {
      console.log(err.message);
    }
    // check if username is taken
    var exist = users.some((user) => {
      if(user.username === username){
        return true;
      }
    });
    
    if (!exist) {
      db.run(
        `INSERT INTO users VALUES(?, ?, ?)`,
        [username, password, role],
        function(err) {
          if (err) {
            console.log(err.message);
          }
        }
      );
      // create session for user
      req.session.userId = username;
      req.session.role = role;
      return res.send(true);
    } else {
      return res.send(false);
    }
  });
});

router.post("/login", (req, res) => {
  var { username, password } = req.body;
  // get all users
  db.all("SELECT * FROM users", (err, users) => {
    if (err) {
      console.log(err.message);
    }
    // search to see if the user trying to login is in the database
    users.some(user => {
      if (user.username === username && user.password === password) {
        // create session for user
        req.session.userId = user.username;
        req.session.role = user.role;
        return res.send(true);
      }
      return res.send(false);
    });
  });
});

router.post("/logout", (req, res) => {
  // end session for user
    req.session = null;
    res.clearCookie("session");
    if(req.session === null){
      return res.send(true);
    }
    return res.send(false);
});

module.exports = router;
