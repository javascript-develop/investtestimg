const mongoose = require("mongoose");

// Define the schema for deposit orders
const planSchema = new mongoose.Schema({
  planName: {
    type: String,
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
  transactionId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
