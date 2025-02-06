const mongoose = require('mongoose');

// Define the schema
const leaveApplicationSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: { type: String, enum: ['CL', 'ML', 'PL'], required: true }, // Updated SL to ML, EOL to SL
  createdAt: { type: Date, default: Date.now }, // Automatically set the timestamp
});

// Create a model
const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

module.exports = LeaveApplication;
