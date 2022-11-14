const mongoose = require("mongoose");
const path = require("path");

const coverImageBasePath = "images/users";

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
});

// Append image to file in folder
userSchema.virtual("coverImagePath").get(function () {
  if (this.profileImage != null) {
    return path.join("/", coverImageBasePath, this.profileImage);
  }
});

module.exports = mongoose.model("User", userSchema);
module.exports.coverImageBasePath = coverImageBasePath;
