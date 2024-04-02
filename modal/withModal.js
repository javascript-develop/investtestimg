const mongoose = require('mongoose');

// Define the schema for withdrawal requests
const withdrawalSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  withdrawalAmount: {
    type: Number,
    required: true
  },
  withdrawalMethod: {
    type: String,
    required: true
  },
  withdrawalAddress: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for withdrawal requests using the schema
const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
