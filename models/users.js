const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  birthday: {
    type: Date,
    required: true,
    default: Date.now,
  },

  password: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },

  //   profileImage: {
  //     type: String,
  //     required: true,
  //   },

  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
