const mongoose = require('mongoose');

// Define the schema
const customizeLeaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  name: { type: String, required: true },
  designation: { type: String, required: true }, 


  
  reportingHeadSignature: { type: String, default: "" }, // Reporting Head's Signature
  reportingHeadReason: { type: String, default: "" }, // Reason from Reporting Head
  sanctioningAuthoritySignature: { type: String, default: "" }, // Sanctioning Authority's Signature
  sanctioningAuthorityReason: { type: String, default: "" }, // Reason from Sanctioning Authority


  
  leaveType: { 
    type: String, 
    enum: ['CL', 'ML', 'PL'],  // CL remains CL, SL becomes ML, EOL becomes SL
    required: true 
  }, // Casual Leave (CL), Medical Leave (ML), Special Leave (SL)
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  numOfDays: { 
    type: Number, 
    required: true, 
    min: [1, 'Number of days must be at least 1'] 
  }, // Ensures leave is at least 1 day
  reason: { type: String, required: true },
  attachments: { type: [String], default: [] }, // Stores file paths, ensures default empty array
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }, // Leave approval status
 createdAt: { type: Date, default: Date.now },

  notified: { type: Boolean, default: false },

  
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Create and export the model
const CustomizeLeave = mongoose.model('CustomizeLeave', customizeLeaveSchema);

module.exports = CustomizeLeave;
