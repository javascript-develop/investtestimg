const mongoose = require("mongoose");

// Define the schema for deposit orders
const depositSchema = new mongoose.Schema({
  plan: {
    type: Object,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  depositMethod: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: { type: String, default: "pending" },
  email: { type: String, required: true },
});

// Create a model from the schema
const Deposit = mongoose.model("Deposit", depositSchema);

module.exports = Deposit;
