$(document).ready(function () {

    // button links
    $('#loginBtn').on('click', () =>  window.location = "/login");
    $('#signUpBtn').on('click', () => window.location = "/signup");

    // get login info
    $('#submitBtn').on('click', () => {
       var username =  $('#usernameText')[0].value;
       var password = $('#passwordText')[0].value;

       $('#usernameText')[0].value = '';
       $('#passwordText')[0].value = '';
       
       console.log(username);
       console.log(password);
    });
    // article URL creation
    $("#article").on('click', (event) =>{
        var articleTitle = $("#title")[0].textContent;
        var articleTitleUrl = articleTitle.split(" ").join("-")
        window.location = "/article/" + articleTitleUrl; 
    });

    $('#myPosts').on('click', () =>  window.location = "/posts");
    $('#logout').on('click', () =>  window.location = "/logout");
});