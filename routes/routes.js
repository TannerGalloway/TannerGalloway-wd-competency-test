const express = require("express");
const db = require("../models");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

// homepage.
router.get("/", (req, res) => {
  var {role}  = req.session;

  var renderObj = {
    homeClass: "active",
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

  db.Article.findAll({limit: 6}).then((articles) => {
      articles.map((article) =>{
        var articledata = {
          userid: "",
          title: "",
          articleSummary: "",
          articleLink: ""
        };
        
        articledata.userid = article.dataValues.userid;
        articledata.title = article.dataValues.title;
        article.dataValues.content .length > 100 ? articledata.articleSummary = article.dataValues.content.substring(0, 100) + "..." : articledata.articleSummary = article.dataValues.content.substring(0, 100);
        articledata.articleLink = "/article/" + articledata.title.split(" ").join("%20");
        renderObj.articles.push(articledata);
      });
      res.render("index", renderObj);
    });
});

// list of articles.
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

  db.Article.findAll().then((articleData) => {
    renderObj.articles = articleData;
    res.render("articlesList", renderObj)
  });
});

// main article page.
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

    db.Article.findAll({
      where: {
        title: clickedArticle
      }
    }).then((article) => {
        renderObj.title = article[0].dataValues.title;
        renderObj.user = article[0].dataValues.userid;
        renderObj.category = article[0].dataValues.category;
        renderObj.content = article[0].dataValues.content;
        res.render("article", renderObj)
    });
});

// login page.
router.get("/login", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Login",
    signup: false,
    placeholderUsername: "Enter Username",
    placeholderPassword: "Enter Password"
  });
});

// signup page.
router.get("/signup", (req, res) => {
  res.render("AccountAndPosts", {
    formtype: "Sign Up",
    signup: true,
    placeholderUsername: "Create Username",
    placeholderPassword: "Create Password"
  });
});

// editor articles page.
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

    // get articles for logged in user.
    db.Article.findAll({
      where: {
        userid: userId
      }
    }).then((returnedArticle) => {
      returnedArticle.map(article => {
        renderObj.articles.push(article);
        article.editor = true;
      });
      res.render("articlesList", renderObj);
    });
  }else if(role === "Admin"){
    renderObj.admin = true;

    // get all articles.
    db.Article.findAll().then((returnedArticles) => {
      returnedArticles.map(article => {
        renderObj.articles.push(article);
        article.admin = true;
      });
      res.render("articlesList", renderObj);
    });
  };
});

// editor article creation page.
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

// article edit page.
router.get("/edit/:article", (req, res) => {
  var {userId}  = req.session;

  if(!userId){
    return res.redirect("/login");
  }

  var editArticle = req.params.article;
  editArticle = editArticle.split("%20").join(" ");


  db.Article.findAll({
    where: {
      title: editArticle,
      userid: userId
    }
  }).then((article) => {
    var renderObj = {
      navEditor: true,
      title: article[0].dataValues.title,
      category: article[0].dataValues.category,
      content: article[0].dataValues.content
    };
    res.render("edit", renderObj)
  });
});

// display all users.
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

  // only get editors and vanilla users.
  db.User.findAll({
    where: {
      role: ["Editor", "Vanilla"]
    }
  }).then((returnedusers) => {
    returnedusers.map(user =>{
      renderObj.users.push(user);
    });
    res.render("userslist", renderObj)
  });
});

router.post("/create", (req, res) => {
  var {title, category, content} = req.body;
  var {userId}  = req.session;
  
  // get all articles written by user.
  db.Article.findAll({
    where: {
      userid: userId
    }
  }).then((userArticles) => {
    if(userArticles.length === 0){
      db.Article.create({
        userid: userId,
        title: title,
        category: category,
        content: content
      }).then(() => {return res.send(true)});
    }else{
      // check if article has been created already.
      var titleExist = userArticles.some((article) => {
        return article.dataValues.title === title;
      });
      var contentExist = userArticles.some((article) => {
        return article.dataValues.content === content;
      });
      // if article has not been created create article.
      if(titleExist || contentExist){
        return res.send(false);
      }else{
        db.Article.create({
          userid: userId,
          title: title,
          category: category,
          content: content
        }).then(() => {
            return res.send(true);
        }).catch(() => {
          return res.send(false);
        });
      }
    }
  });
});

router.post("/edit", (req, res) => {
  var {prevtitle, title, category, content} = req.body;
  var {userId}  = req.session;
  var updatedata = {
    title: title,
    category: category,
    content: content
  };

  // update article.
  db.Article.update(updatedata, {
    where: {
      userid: userId,
      title: prevtitle
    }
  }).then(() => {
      return res.send(true);
  }).catch(() => {
    return res.send(false);
  });
});

router.post("/delete", (req, res) => {
  var {title, author} = req.body;
  var {userId, role}  = req.session;
  author = author.substring(8);

  
// delete article.
if(role === "Editor"){
  db.Article.destroy({
    where: {
      userid: userId,
      title: title
    }
  }).then(() => {
      return res.send(true);
  }).catch(() => {
    return res.send(false);
  });
}else if(role === "Admin"){
  db.Article.destroy({
    where: {
      userid: author,
      title: title
    }
  }).then(() => {
      return res.send(true);
  }).catch(() => {
    return res.send(false);
  });
}
});

// ban user.
router.post("/ban", (req, res) => {
  var {userid} = req.body;
  var userban = {
    role: "Banned"
  };

  db.User.update(userban, {
    where: {
      username: userid
    }
  }).then(() => {
      db.Article.destroy({
        where: {
          userid: userid
        }
      }).then(() => {
          return res.send(true);
      }).catch(() => {
        return res.send(false);
      });

  }).catch(() => {
    return res.send(false);
  });
});

// signup session. 
router.post("/signup", (req, res) => {
  var { username, password, role } = req.body;

  // get all users.
  db.User.findAll().then((users) => {
    // check if username is taken.
    var exist = users.some((user) => {
      if(user.username === username){
        return true;
      }
    });
    
    if (!exist) {
      // hash password.
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
          console.log(err);
        };

        // insert user into database.
        db.User.create({
          username: username,
          password: hash,
          role: role
        });
      });

      // create session for user.
      req.session.userId = username;
      req.session.role = role;
      return res.send(true);
    }
    else{
      res.send(false);
    }
    });
  });


// login session.
router.post("/login", (req, res) => {
  var { username, password } = req.body;

  // get all users.
  db.User.findAll().then((users) => {
    // check to see if there are no users.
    if(users.length === 0){
      return res.send(false);
    }
    else{
      // search to see if the user trying to login is in the database and if they are Banned or not.
      users.some(user => {
        if(user.username === username && user.role === "Banned"){
          // delete user account.
          db.User.destroy({
            where: {
              username: username,
              role: "Banned"
            }
          }).then(() => {
              return res.send("Banned");
          });
        }
        else if(user.username === username){
          bcrypt.compare(password, user.password, (err, passRes) => {
            if(err){
              return res.send(false);
            };
            if(passRes){
              // create session for user.
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

// logout session.
router.post("/logout", (req, res) => {
  // end session for user.
    req.session = null;
    res.clearCookie("Account Session");
    if(req.session === null){
      return res.send(true);
    }
    return res.send(false);
});

module.exports = router;
