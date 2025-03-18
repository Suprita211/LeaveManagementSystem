const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const EmpMaster = require('../models/EmpMaster');

exports.register = async (req, res) => {
  const { PrimaryContactNumber, password, usertype } = req.body;

  try {
    // Check if EmployeeEmailID is provided
    if (!PrimaryContactNumber || !password) {
      return res.status(400).json({ message: 'EmployeeEmailID and password are required' });
    }

    // Find employee in EmpMaster
    let employee = await EmpMaster.findOne({  PrimaryContactNumber });
    // console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found in master records' });
    }

    // Ensure EmpID exists in the employee record
    if (!employee.EmpID) {
      console.error(`EmpID not found for EmployeeEmailID: ${PrimaryContactNumber}`);
      return res.status(500).json({ message: 'EmpID not found for the employee' });
    }

    // Check if the user is already registered
    const existingUser = await User.findOne({ where: { PrimaryContactNumber } });

    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Create new user with EmpID
    const newUser = await User.create({
      PrimaryContactNumber,
      EmpID: employee.EmpID, // Fetch and store EmpID
      password,
      usertype: usertype || 'user' // Default usertype is 'user'
    });

    return res.status(201).json({
      message: 'User registered successfully',
      PrimaryContactNumber,
      EmpID: employee.EmpID,
      EmpName: employee.EmpName
    });

  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



exports.login = async (req, res) => {
  const { PrimaryContactNumber, password } = req.body;

  try {
    // Validate input
    if (!PrimaryContactNumber || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check user credentials
    const user = await User.findOne({ PrimaryContactNumber }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get employee details from EmpMaster
    const employee = await EmpMaster.findOne({ EmpID: user.EmpID });

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        EmpID: user.EmpID,
        number: user.PrimaryContactNumber,
        usertype: user.usertype
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      token,
      user: {
        EmpID: user.EmpID,
        number: user.PrimaryContactNumber,
        usertype: user.usertype,
        // employeeDetails: employee
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
