$(document).ready(function() {
  // get login/signup info
  $("#submitBtn").on("click", () => {
    var username = $("#usernameText")[0].value;
    var password = $("#passwordText")[0].value;
    var role = $("input[name=Choose]:checked", "#accountAuth").val();
    var checked = $("input[name=Choose]").is(":checked");
    var emptyErr = $("<div/>").addClass("alert alert-danger").attr("role", "alert").text("Please enter a username, password");
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
          }
        );
      } 
  });

  // article URL creation
  $(".article").on("click", event => {
    var articleTitle = $(".title")[0].textContent;
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
