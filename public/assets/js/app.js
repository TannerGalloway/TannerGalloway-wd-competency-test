$(document).ready(function() {

  // get url of current page
  var url = window.location.pathname;

  // get previous page url
  var prevUrl = document.referrer.substring(document.referrer.lastIndexOf("/"), document.referrer.length);

  // home page needs to be reloaded for articles to be populated.
  if(url === "/" && prevUrl === "/login" || url === "/" && prevUrl === "/signup"){
    window.location.reload(true);
  }
  
  // get login/signup info
  $("#accountSubmitBtn").on("click", () => {
    var username = $("#usernameText")[0].value;
    var password = $("#passwordText")[0].value;
    var role = $("input[name=Role]:checked", "#accountAuth").val();
    var checked = $("input[name=Role]").is(":checked");
    var emptyErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("Please enter a username or password");
    var filledErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert");
    var banErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("Your Account has been Banned!");

    // checks to see if all the fields are filled in
    // login
    if (username.length === 0 || password.length === 0) {
        $(".alert").remove();
        $(".modal-dialog").prepend(emptyErr);

    } //signup
    else if(url === "/signup" && !checked){
        // for radio buttons on sign up page
        $(".alert").remove();
        $(".modal-dialog").prepend(emptyErr);
        $(".alert").text("Please enter a username, password or select a role.");
        
    }else {
        // send data to database
        $.post(url, { username: username, password: password, role: role }, userAuth => {          
            if (userAuth) {
              if(userAuth === "Banned"){
                if ($(".alert").length >= 0 ){
                  $(".alert").remove();
                  $(".modal-dialog").prepend(banErr);
                }
                $("#usernameText")[0].value = "";
                $("#passwordText")[0].value = "";
              }else{
                // if authenticated, login
                window.location = "/";
              }
            } else {
              // if alert is not on screen and err is present display correct error
              if ($(".alert").length >= 0 ) {
                $(".alert").remove();
                $(".modal-dialog").prepend(filledErr);
                switch(url){
                    case "/login": 
                        $(".alert").text("The username or password you entered is incorrect.");
                    break;

                    case "/signup":
                        $(".alert").text("That Username is already taken.");
                    break;
                  }
              }
            }
          });
      } 
  });

// create article/edit article
$(".articleSubmitBtn").on("click", () => {

   // find url user is on and get article title
  var webURL = url.substring(0, url.lastIndexOf("/"));
  var currentArticle = url.substring(url.lastIndexOf("/") + 1, url.length);
  currentArticle = currentArticle.split("%20").join(" ");

  if(url === "/create"){
    webURL = url;
  }

  // get article info
  var title = $(".titleText")[0].value;
  var category = $(".catagoryText")[0].value;
  var content = $("#articleBody")[0].value;

  // errors/success message
  var emptyErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("Please enter a title, category or article body.");
  var filledErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("An error has occured while updating this article."); 
  var successMessage = $("<div/>").addClass("alert alert-success").attr("role", "alert");

   // checks to see if all the fields are filled in
  if(title.length === 0 || category.length === 0 || content === 0){
    $(".alert").remove();
    $(".modal-dialog").prepend(emptyErr);
  }else{
    // send data to database
    $.post(webURL, { prevtitle: currentArticle, title: title, category: category, content: content }, articleUpdate => {
      // if article crated successfully
      if(articleUpdate){
        $(".alert").remove();
        $(".modal-dialog").prepend(successMessage);
        switch(webURL){
          case "/create": 
              $(".alert").text("Article Created Successfully!");
              $(".titleText")[0].value = "";
              $(".catagoryText")[0].value = "";
              $("#articleBody")[0].value = "";
          break;

          case "/edit":
              $(".alert").text("Article Updated Successfully!");
          break;
        }
      }else{
        // if alert is not on screen and err is present display error
          if($(".alert").length >= 0 ){
            $(".alert").remove();
            $(".modal-dialog").prepend(filledErr);
          }
      }
    });
  }
});

// article update
$(".update").on("click", (event) => {
  var articleTitle = $(".title")[event.target.id].textContent;
  var articleTitleUrl = articleTitle.split(" ").join("%20");
  window.location = "/edit/" + articleTitleUrl;
});

// delete article
$(".delete").on("click", (event) => {
  var articleTitle = $(".title")[event.target.id].textContent;
  var Author = $(".Author")[event.target.id].textContent;
  var err = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("An error has occured when deleteing this article.");
  
  $.post("/delete", {title: articleTitle, author: Author }, confirmDelete => {
    // if successful show success message
    if(confirmDelete){
      window.location.reload();
    }else{
      // show error
      if($(".alert").length >= 0 ){
        $(".alert").remove();
        $(".articles").prepend(err);
      }
    }
  });
});

  // article URL creation
  $(".articleBtn").on("click", (event) => {
    var articleTitle = $(".title")[event.target.id].textContent;
    var articleTitleUrl = articleTitle.split(" ").join("%20");
    window.location = "/article/" + articleTitleUrl;
  });

  // my posts actions and admin actions
  $("#myPosts, #userposts").on("click", () => {window.location = "/posts"});
  $("#users").on("click", () => {window.location = "/users"});
  
  // ban user
  $(".userBtn").on("click", (event) => {
    var Author = $(".Author")[event.target.id].textContent;
    var err = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("An error has occured when banning this user.");
    
    $.post("/ban", {userid: Author}, banstatus => {
      // if successful show success message
      if(banstatus){
        window.location.reload();
      }else{
        // show error
        if($(".alert").length >= 0 ){
          $(".alert").remove();
          $(".users").prepend(err);
        }
      }
    });
  });

// logout action
  $(".logoutBtn").on("click", () => {
    $.post("/logout", {}, logout => {
      if(logout){
        window.location = "/login";
      }else{
        window.location = "/";
      }
    });
  });
});
