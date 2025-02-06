const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  // Ensure the counter name is unique
    },
    value: {
      type: Number,
      default: 0,  // Default value of the counter (starts from 0)
    },
  },
  { timestamps: true }
);

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
