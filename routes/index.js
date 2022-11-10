const express = require("express");
const multer = require("multer");
const upload = multer();
const { appendFile } = require("fs");
const path = require("path");
const User = require("../models/users");

const app = express();
app.use(express.json());

/* GET home page. */
app.get("/", async function (req, res) {
  let users;
  try {
    users = await User.find({}).sort({ createdAt: "desc" }).limit(10).exec();
  } catch {
    users = [];
  }
  res.render("index", { users: users });
});

// New User Route
app.get("/new", function (req, res) {
  res.render("form", { user: new User() });
});

//Create User Route
app.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    userName: req.body.userName,
    birthday: new Date(req.body.birthday),
    password: req.body.password,
    status: req.body.status,
  });

  try {
    const newUser = await user.save();
    res.redirect("/");
  } catch {
    res.render("form", {
      user: user,
      errorMessage: "Error creating User",
    });
  }
});

module.exports = app;
