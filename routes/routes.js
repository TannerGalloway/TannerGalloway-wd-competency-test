const express = require("express");
const news = require("../models/news.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();

// homepage
router.get("/", (req, res) => {
  var {role}  = req.session;
  var renderObj = {
    homeClass: "active",
    vanilla: false,
    navEditor: false,
    admin: false,
    categories: []
  };

  var categoryIndex = 0;
  var categoryIterate = 0;
  var loopIterate = 0;
  switch(role){
    case "Vanilla": renderObj.vanilla = true;
    break;

    case "Editor": renderObj.navEditor = true;
    break;

    case "Admin": renderObj.admin = true;
    break;
  }

  // get article categories
  news.group("category", "category", "articles", (articleCategories) => {
    renderObj.categories = articleCategories;
    categoryIterate = articleCategories.length;
    for(var i = 0; i < articleCategories.length; i++){
      renderObj.categories[i].articles = [];
      // get 3 articles from the categories that are returned
      news.limitConditionSearch("category", "userid", "title", "articles", "'" + articleCategories[i].category + "'", 3, (articleData) => {     
        // add the articles to the proper category articles array
        articleData.map(article => {
          renderObj.categories[categoryIndex].articles.push(article);
        });
        categoryIndex++;
      });
      loopIterate = i + 1;
    };
    // if data is display ready, render it.
    dbdone(categoryIterate, loopIterate).then(res.render("index", renderObj));
  });
  // database querying and data send back done.
  dbdone = (categories, iterate) => {
    if(categories === iterate){
      return new Promise((resolve) =>{
        resolve("render");
      });
    }
  }
});

// list of articles
router.get("/articles", (req, res) => {
  var {role}  = req.session;

  var renderObj = {
    articlesClass: "active",
    vanilla: false,
    navEditor: false,
    admin: false,
    articles: []
  };

  switch(role){
    case "Vanilla": renderObj.vanilla = true;
    break;

    case "Editor": renderObj.navEditor = true;
    break;

    case "Admin": renderObj.admin = true;
    break;
  }

  news.all("articles", (articleData) => {

    articleData.map(article => {
      renderObj.articles.push(article);
    });
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
      navEditor: false,
      admin: false
    };

    switch(role){
      case "Vanilla": renderObj.vanilla = true;
      break;
  
      case "Editor": renderObj.navEditor = true;
      break;
  
      case "Admin": renderObj.admin = true;
      break;
    }

    var clickedArticle = req.params.article;
    clickedArticle = clickedArticle.split("%20").join(" ");
    clickedArticle = '"' + clickedArticle + '"';

    news.conditionSearch("title", "articles", clickedArticle, (article) => {
        renderObj.title = article[0].title;
        renderObj.user = article[0].userid;
        renderObj.category = article[0].category;
        renderObj.content = article[0].content;
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

// editor articles page
router.get("/posts", (req, res) => {
  var {userId, role}  = req.session;

  if(!userId){
    return res.redirect("/login");
  }

  var renderObj = {
    articlesClass: "active",
    navEditor: false,
    editor: false,
    admin: false,
    articles: []
  };

  if(role === "Editor"){
    renderObj.navEditor = true;
    renderObj.editor = true;
    news.conditionSearch("userid", "articles", '"' + userId + '"', (returnedArticle) => {
      returnedArticle.map(article => {
        renderObj.articles.push(article);
        article.editor = true;
      }); 
    });
  }else if(role === "Admin"){
    renderObj.admin = true;
    news.all("articles", (returnedArticles) => {
      returnedArticles.map(article => {
        renderObj.articles.push(article);
        article.admin = true;
      });
    });
  };

  res.render("articlesList", renderObj);
});

// editor article creation page
router.get("/create", (req, res) => {
  var {userId}  = req.session;

  if(!userId){
    return res.redirect("/login");
  }

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

  if(!userId){
    return res.redirect("/login");
  }

  var editArticle = req.params.article;
  editArticle = editArticle.split("%20").join(" ");
  editArticle = '"' + editArticle + '"';

  news.search2conditions("title", "userid", "articles", editArticle, '"' + userId + '"', (article) => {
    var renderObj = {
      navEditor: true,
      title: article[0].title,
      category: article[0].category,
      content: article[0].content
    };
    res.render("edit", renderObj);
  });
  
});

// display all users
router.get("/users", (req, res) => {
  var {userId}  = req.session;

  if(!userId){
    return res.redirect("/login");
  }

  var renderObj = {
    articlesClass: "active",
    navEditor: false,
    editor: false,
    admin: true,
    users: []
  };

  // only get editors and vanilla users
  news.usersselect("role", "users", '"Editor"', '"Vanilla"', (returnedusers) => {
    returnedusers.map(user =>{
      renderObj.users.push(user);
    });
  });
  res.render("userslist", renderObj);
});

router.post("/create", (req, res) => {
  var {title, category, content} = req.body;
  var {userId}  = req.session;
  userId = '"' + userId + '"';
  title = '"' + title + '"';
  category = '"' + category + '"';
  content = '"' + content + '"';
  
  // get all articles written by user
  news.conditionSearch("userid", "articles", userId, (userArticles) => {
    // check if article has been created already
    var exist = userArticles.some((article) => {
      if(article.title === title || article.content === content){
        return true;
      }
    });

    if(!exist){

      news.insert("articles", userId + ', ' + title + ', ' + category + ', ' + content, (err) =>{
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
  title = '"' + title + '"';
  prevtitle = '"' + prevtitle + '"';
  category = '"' + category + '"';
  content = '"' + content + '"';
  userId = '"' + userId + '"';

  // update article
  news.update("articles", "title", "category", "content", title, category, content, "userid", "title", userId, prevtitle, (updateStatus) =>{
    if (updateStatus) {
      return res.send(true);
    }
    return res.send(false);
  });
});

router.post("/delete", (req, res) => {
  var {title, author} = req.body;
  var {userId, role}  = req.session;
  author = author.substring(8);
  title = '"' + title + '"';
  userId = '"' + userId + '"';
  author = '"' + author + '"';

  
// delete article
if(role === "Editor"){
  news.deleteMany("articles", "userid", "title", userId, title, (delStatus) => {
    if (delStatus) {
      return res.send(true);
    }
    return res.send(false);
  });
}else if(role === "Admin"){
  news.deleteMany("articles", "userid", "title", author, title, (delStatus) => {
    if (delStatus) {
      return res.send(true);
    }
    return res.send(false);
  });
}
});

// ban user
router.post("/ban", (req, res) => {
  var {userid} = req.body;
  userid = '"' + userid + '"';

  news.updateUsers("users", "role", '"Banned"', "username", userid, (updateStatus) => {
    if(updateStatus){
      news.delete("articles", "userid", userid, (delstatus) => {
        if(delstatus){
          return res.send(true);
        }
        return res.send(false);
      });
    }else{
      return res.send(false);
    }
  });
});

// signup session 
router.post("/signup", (req, res) => {
  var { username, password, role } = req.body;
  usernameDB = '"' + username + '"';
  roleDB = '"' + role + '"';
  // get all users
  news.all("users", (users) => {
    // check if username is taken
    var exist = users.some((user) => {
      if(user.username === username){
        return true;
      }
    });
    
    if (!exist) {
      // hash password
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
          console.log(err);
        };
        hash = '"' + hash + '"';
        news.insert("users", usernameDB + ', ' + hash + ', ' + roleDB, (err) => {
          if (err) {
            console.log(err.message);
          }
        });
      });

      // create session for user
      req.session.userId = username;
      req.session.role = role;
      return res.send(true);
    }
    else{
      res.send(false);
    }
  });
});

// login session
router.post("/login", (req, res) => {
  var { username, password } = req.body;
  
  // get all users
  news.all("users", (users) => {
    // check to see if there are no users
    if(users.length === 0){
      return res.send(false);
    }
    else{
      // search to see if the user trying to login is in the database
      users.some(user => {
        if(user.role === "Banned"){
          news.delete("users", "role", '"Banned"', (userDelStatus) => {
            if(userDelStatus){
              return res.send("Banned");
            }
          });
        }
        else if(user.username === username){
          bcrypt.compare(password, user.password, (err, passRes) => {
            if(err){
              console.log(err);
            };
            if(passRes){
              // create session for user
              req.session.userId = user.username;
              req.session.role = user.role;
              return res.send(true);
            }else{
              return res.send(false);
            }
          });
        };
    })};
  });
});

// logout session
router.post("/logout", (req, res) => {
  // end session for user
    req.session = null;
    res.clearCookie("Account Session");
    if(req.session === null){
      return res.send(true);
    }
    return res.send(false);
});

module.exports = router;