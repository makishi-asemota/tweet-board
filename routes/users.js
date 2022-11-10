const { query } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
// const uploadPath = path.join("public", Book.coverImageBasePath);
// const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// Create New User
// router.get("/new", function (req, res) {
//   res.render("form");
// });

// //Create User Route
// router.post("/", upload.none(), async (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     userName: req.body.userName,
//     birthday: new Date(req.body.birthday),
//     password: req.body.password,
//     status: req.body.status,
//   });

//   try {
//     const newUser = await user.save();
//     res.redirect(`/`);
//   } catch {
//     res.render("form", {
//       user: user,
//       errorMessage: "Error creating User",
//     });
//   }
// });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
