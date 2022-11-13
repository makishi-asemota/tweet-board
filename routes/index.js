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

// Password Authentication route
app.get("/:id/password", async (req, res) => {
  res.render("password");
});

// Check if password is correct
app.post("/:id/password", async (req, res) => {
  let user;
  try {
    user = await User.findOne({ password: req.body.password });
    if (user.password == req.body.password) {
      res.redirect(`/${user.id}/edit`);
    }
  } catch {
    res.render("password", {
      errorMessage: "Wrong Password LoL",
    });
  }
});

// Edit User Page
app.get("/:id/edit", async (req, res) => {
  let user;
  try {
    // mongoose method to find author in database
    user = await User.findById(req.params.id);
    res.render("edit", { user: user });
  } catch {
    res.redirect("/");
  }
});

// Delete Page
app.get("/:id/edit/delete", async (req, res) => {
  let user;
  user = await User.findById(req.params.id);
  res.render("delete", { user: user });
});

// Delete User
// app.post("/:id/edit/delete", async (req, res) => {
//   let user;
//   try {
//     user = await User.findOne({ password: req.body.password });
//     if (user.password == req.body.password) {
//       res.redirect("/");
//     }
//   } catch {
//     res.render("delete", {
//       errorMessage: "Wrong Password LoL",
//     });
//   }
// });

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

// Delete user method
app.delete("/:id/edit/delete", async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const result = await User.deleteOne(query);
  res.redirect("/");
  // let user;
  // try {
  //   user = await User.findById(req.params.id);
  //   await user.remove();
  //   res.redirect("/");
  // } catch (err) {
  //   if (user == null) {
  //     res.redirect("/");
  //   }
  //   console.log(err);
  // }
});

module.exports = app;
