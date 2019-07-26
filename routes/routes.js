var express = require("express");
var router = express.Router();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./db/newsApp.db");

// homepage
router.get("/", (req, res) => {
  var {role}  = req.session;
  var renderObj = {
    homeClass: "active",
    vanilla: false,
    navEditor: false,
    categories: []
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
        for(var i = 0; i < categories.length; i++){
          renderObj.categories.push(categories[i]);
          renderObj.categories[i].articles = [];
            
          db.all("SELECT user_id, title FROM articles WHERE category = ? LIMIT 3", [categories[i].category], (err, articleData) => {
            if(err){
                console.log(err.message);
            }
            
          });
        }
      });
    res.render("index", renderObj);
});

// list of articles
router.get("/articles", (req, res) => {
  var {role}  = req.session;

  var renderObj = {
    articlesClass: "active",
    vanilla: false,
    navEditor: false,
    articles: []
  };

  if(role === "Vanilla"){
    renderObj.vanilla = true;
  }else if(role === "Editor"){
    renderObj.navEditor = true;
  }

  db.each("SELECT * FROM articles", (err, article) => {
      if(err){
        console.log(err.message);
      }
        renderObj.articles.push(article);
  });

  res.render("articlesList", renderObj);
});

// main article page
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

  var clickedArticle = req.params.article;
  clickedArticle = clickedArticle.split("-").join(" ");
  
  db.each("SELECT * FROM articles WHERE title = ?", [clickedArticle], (err, article) => {
    if(err){
      console.log(err.message);
    }

    renderObj.title = article.title;
    renderObj.user = article.user_id;
    renderObj.category = article.category;
    renderObj.content = article.content;
    userId ? res.render("article", renderObj): res.redirect("/login");
  });
});

// login page
router.get("/login", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Login",
    signup: false,
    placeholderUsername: "Enter_Username",
    placeholderPassword: "Enter_Password"
  });
});

// signup page
router.get("/signup", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Sign Up",
    signup: true,
    placeholderUsername: "Create_Username",
    placeholderPassword: "Create_Password"
  });
});

// user editor articles page
router.get("/posts", (req, res) => {
  var {userId}  = req.session;

  var renderObj = {
    articlesClass: "active",
    navEditor: true,
    editor: true,
    vanilla: false,
    articles: []
  };
  
  db.each("SELECT * FROM articles WHERE user_id = ?", [userId], (err, returnedArticle) => {
    if(err){
      console.log(err.message);
    }
    returnedArticle.editor = true; 
    renderObj.articles.push(returnedArticle);
  });
  res.render("articlesList", renderObj);
});

// editor article creation page
router.get("/create", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Create Article",
    navEditor: true,
    editor: true,
    placeholderTitle: "Enter_article_title",
    placeholderCatagory: "Enter_article_category"
  });
});

// article edit page
router.get("/edit", (req, res) => {

  res.render("edit", { navEditor: true});
});

router.post("/create", (req, res) => {
  var {title, category, content} = req.body;
  var {userId}  = req.session;
  
  // get all articles written by user
  db.all("SELECT * FROM articles WHERE user_id = ?", [userId], (err, userArticles) => {
    if(err){
      console.log(err.message);
    }
    // check if article has been written already
    var exist = userArticles.some((article) => {
      if(article.title === title || article.content === content){
        return true;
      }
    });

    if(!exist){
      db.run("INSERT INTO articles VALUES(?, ?, ?, ?)",[userId, title, category, content], (err) => {
          if (err) {
            console.log(err.message);
          }
        });
        return res.send(true);
    }else{
      return res.send(false);
    }
    
  });
});

// signup session 
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
      db.run("INSERT INTO users VALUES(?, ?, ?)", [username, password, role], (err) => {
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

// login session
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

// logout session
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