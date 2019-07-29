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
  var categoryIndex = 0;

  if(role === "Vanilla"){
    renderObj.vanilla = true;
  }else if(role === "Editor"){
    renderObj.navEditor = true;
  }

  // get article categories
  db.all("SELECT category FROM articles GROUP BY category", (err, articleCategories) => {
      if(err){
          console.log(err.message);
      }
        // add article array to each category obj that is returned
        for(var i = 0; i < articleCategories.length; i++){
          renderObj.categories.push(articleCategories[i]);
          renderObj.categories[i].articles = [];

          // get 3 articles from the categories that are returned
          db.all("SELECT user_id, title FROM articles WHERE category = ? LIMIT 3", [articleCategories[i].category], (err, articleData) => {
            if(err){
                console.log(err.message);
            }
           
            // add the articles to the proper category articles array
            articleData.map(article => {
              renderObj.categories[categoryIndex].articles.push(article);
            });
            categoryIndex++;
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

  if(!userId){
    return res.redirect("/login");
  }

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
      res.render("article", renderObj);
    });
});

// login page
router.get("/login", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Login",
    signup: false,
    placeholderUsername: "Enter Username",
    placeholderPassword: "Enter Password"
  });
});

// signup page
router.get("/signup", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Sign Up",
    signup: true,
    placeholderUsername: "Create Username",
    placeholderPassword: "Create Password"
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
router.get("/create/", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Create Article",
    navEditor: true,
    editor: true,
    placeholderTitle: "Enter article title",
    placeholderCatagory: "Enter article category"
  });
});

// article edit page
router.get("/edit/:article", (req, res) => {
  var {userId}  = req.session;
  var editArticle = req.params.article;
  editArticle = editArticle.split("-").join(" ");

  db.each("SELECT * FROM articles WHERE title = ? AND user_id = ?", [editArticle, userId], (err, article) => {
    if(err){
      console.log(err.message);
    }

    var renderObj = {
      navEditor: true,
      title: article.title,
      category: article.category,
      content: article.content
    };

    res.render("edit", renderObj);
  });
});

router.post("/create", (req, res) => {
  var {title, category, content} = req.body;
  var {userId}  = req.session;
  
  // get all articles written by user
  db.all("SELECT * FROM articles WHERE user_id = ?", [userId], (err, userArticles) => {
    if(err){
      console.log(err.message);
    }
    // check if article has been created already
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

router.post("/edit", (req, res) => {
  var {prevtitle, title, category, content} = req.body;
  var {userId}  = req.session;

  // update article
  db.run("UPDATE articles SET title = ?, category = ?, content = ? WHERE user_id = ? AND title = ?",[title, category, content, userId, prevtitle], (err) => {
    if (err) {
      console.log(err.message);
      return res.send(false);
    }
    return res.send(true);
  });

});

router.post("/delete", (req, res) => {
  var {title} = req.body;
  var {userId}  = req.session;

// delete article
  db.run("DELETE FROM articles WHERE user_id = ? AND title = ?",[userId, title], (err) => {
    if (err) {
      console.log(err.message);
      return res.send(false);
    }
    return res.send(true);
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

    // check to see if there are no users
    if(users.length === 0){
      return res.send(false);
    }
    else{
      // search to see if the user trying to login is in the database
      users.some(user => {
        if (user.username === username && user.password === password) {
          // create session for user
          req.session.userId = user.username;
          req.session.role = user.role;
          return res.send(true);
        }
    })};
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