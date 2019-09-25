const express = require("express");
const exphbs = require("express-handlebars");
const helpers = require("handlebars-helpers")(["comparison"]);
const session = require("cookie-session");
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
// create port
const PORT = process.env.port || 3000;

// express middleware 
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session config
app.set("trust proxy", 1);
app.use(session({
  name: "Account Session",
  keys: [process.env.SECRET]
}));

// handlebars
app.engine("hbs", exphbs({ 
  extname: "hbs", 
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts/",
  partialsDir: __dirname + "/views/partials/"
 }));
app.set("view engine", "hbs");

// express router
var routes = require("./routes/routes.js");

app.use(routes);

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
  });