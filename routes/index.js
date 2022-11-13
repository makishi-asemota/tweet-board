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
app.post("/new", async (req, res) => {
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    status: req.body.status,
  });

  try {
    const newUser = await user.save();
    res.redirect("/");
  } catch {
    res.render("form", {
      user: user,
      errorMessage: "Error creating User :(",
    });
  }
});

// Edit User Page
app.get("/:id/edit", async (req, res) => {
  try {
    // mongoose method to find author in database
    const user = await User.find({});
    res.render("edit", { user: user });
  } catch {
    res.redirect("/");
  }
});

// Update User
app.put("/:id/edit", async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    user.name = req.body.name;
    user.userName = req.body.userName;
    user.status = req.body.status;
    await user.save();
    res.redirect("/");
  } catch {
    if (user == null) {
      res.redirect("/");
    }
    res.render("edit", {
      errorMessage: "Error editing user :(",
      user: user,
    });
  }
});

// Delete user
app.delete("/:id/edit", async (req, res) => {
  let user;
  const id = req.params.id;
  const trim = id.trim();
  try {
    user = await User.findById(trim);
    await user.remove();
    res.redirect("/");
  } catch (err) {
    if (user == null) {
      res.redirect("/");
    }
    console.log(err);
    // res.redirect(`/authors/${author.id}`);
  }
});

module.exports = app;
