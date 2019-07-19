const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const path = require('path');
const database = require("./db/db");
require('dotenv').config();

const app = express();
// create port
const PORT = process.env.port || 8080;

// middleware
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create database if not created
database.db();

app.set('trust proxy', 1);

// session config
app.use(session({
  name: process.env.ID,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET,
  cookie: {
    httpOnly: false,
    sameSite: true,
    secure: true
  }
}));

// handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// middleware router
var routes = require("./routes/routes.js");

app.use(routes);

app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
  });