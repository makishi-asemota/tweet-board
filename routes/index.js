const express = require("express");
const multer = require("multer");
const User = require("../models/users");
const fs = require("fs");
const path = require("path");
const uploadPath = path.join("public", User.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

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
app.post("/new", upload.single("image"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    profileImage: fileName,
    status: req.body.status,
  });
  // saveProfileImage(user, req.body.image);
  try {
    const newUser = await user.save();
    res.redirect("/");
  } catch {
    if (user.coverImageName != null) {
      removeProfileImage(user.coverImageName);
    }
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
  try {
    // mongoose method to find author in database
    const user = await User.findById(req.params.id);
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

// Update User
app.put("/:id", async (req, res) => {
  let user;
  const fileName = req.file != null ? req.file.filename : null;
  try {
    user = await User.findById(req.params.id);
    user.userName = req.body.userName;
    user.password = req.body.password;
    user.status = req.body.status;
    user.profileImage = fileName;
    await user.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    if (user !== null) {
      res.render("edit", {
        errorMessage: "Error editing user :(",
        user: user,
      });
    }
    res.redirect("/");
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

// Remove profile image from database if there is error
function removeProfileImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

module.exports = app;
