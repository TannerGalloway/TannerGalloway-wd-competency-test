$(document).ready(function() {
  // get login/signup info
  $("#accountSubmitBtn").on("click", () => {
    var username = $("#usernameText")[0].value;
    var password = $("#passwordText")[0].value;
    var role = $("input[name=Choose]:checked", "#accountAuth").val();
    var checked = $("input[name=Choose]").is(":checked");
    var emptyErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("Please enter a username or password");
    var filledErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert"); 


    // checks to see if all the fields are filled in
    // login
    if (username.length === 0 || password.length === 0) {
        $(".alert").remove();
        $(".modal-dialog").prepend(emptyErr);

    } //signup
    else if(window.location.pathname === "/signup" && !checked){
        // for radio buttons on sign up page
        $(".alert").remove();
        $(".modal-dialog").prepend(emptyErr);
        $(".alert").text("Please enter a username, password or select a role.");
        
    }else {
        // send data to database
        $.post(window.location.pathname, { username: username, password: password, role: role }, userAuth => {
            if (userAuth) {
              // if authenticated, login
              window.location = "/";
            } else {
              // if alert is not on screen and err is present display correct error
              if ($(".alert").length >= 0 ) {
                $(".alert").remove();
                $(".modal-dialog").prepend(filledErr);
                switch(window.location.pathname){
                    case "/login": 
                        $(".alert").text("The username or password entered is incorrect.");
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

// create article
$("#articleSubmitBtn").on("click", () => {
  // get article info
  var title = $("#titleText")[0].value;
  var category = $("#catagoryText")[0].value;
  var content = $("#articleBody")[0].value;

  // errors/success message
  var emptyErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("Please enter a title, category or article body.");
  var filledErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("You already created that article."); 
  var successMessage = $("<div/>").addClass("alert alert-success").attr("role", "alert").text("Article Created successfully!");

   // checks to see if all the fields are filled in
  if(title.length === 0 || category.length === 0 || content === 0){
    $(".alert").remove();
    $(".modal-dialog").prepend(emptyErr);
  }else{
    // send data to database
    $.post("/create", { title: title, category: category, content: content }, articleCreation => {
      // if article crated successfully
      if(articleCreation){
        $("#titleText")[0].value = "";
        $("#catagoryText")[0].value = "";
        $("#articleBody")[0].value = "";

        $(".alert").remove();
        $(".modal-dialog").prepend(successMessage);
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
$("#update").on("click", () => {
  window.location = "/edit";
});

  // article URL creation
  $(".articleBtn").on("click", (event) => {
    var articleTitle = $(".title")[event.target.id].textContent;
    var articleTitleUrl = articleTitle.split(" ").join("-");
    window.location = "/article/" + articleTitleUrl;
  });

  // my posts action + logout action
  $("#myPosts").on("click", () => {window.location = "/posts"});
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
