const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
  },
  userId: {
    type: Number,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
  plan: {
    type: Object,
    default: null,
  },
  membershipExpiration: {
    type: Date,
  },
  wallet: {
    type: String,
    default: "0.00",
  },
  return: {
    type: String,
    default: "0.00",
  },
});

userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ email: this.email }, "DPEEHEOEEPEERUR78USXPEPEEHA", {
    expiresIn: "1h",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
