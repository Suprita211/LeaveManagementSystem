const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  EmployeeEmailID: {
    type: String,
    required: true,
    unique: true,
    ref: 'EmpMaster' // Reference to EmpMaster collection
  },
  EmpID: {
    type: String,
    required: true, // Ensure EmpID is stored
    ref: 'EmpMaster' // Reference to EmpMaster collection
  },
  password: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
