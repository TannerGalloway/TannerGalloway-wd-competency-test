const express = require("express");
const exphbs = require("express-handlebars");
const session = require("cookie-session");
const path = require('path');
const database = require("./db/db");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
// create port
const PORT = process.env.port || 8080;

// express middleware 
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create database if not created
database.db();

// session config
app.set('trust proxy', 1);
app.use(session({
  name: 'session',
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
    console.log("Server listening on: http://localhost:" + PORT);
  });