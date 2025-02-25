const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const EmpMaster = require('../models/EmpMaster');

exports.register = async (req, res) => {
  const { EmployeeEmailID, password, usertype } = req.body;

  try {
    // Check if the employee exists in EmpMaster
    const employee = await EmpMaster.findOne({ EmployeeEmailID });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found in master records' });
    }

    // Check if the user is already registered
    const existingUser = await User.findOne({ EmployeeEmailID });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Create new user with EmpID fetched from EmpMaster
    console.log(EmployeeEmailID, password, EmpID , usertype);
    const newUser = new User({
      EmployeeEmailID,
      EmpID: employee.EmpID, // Fetch and store EmpID
      password,
      usertype: usertype || 'user' // Default usertype is 'user'
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      EmployeeEmailID,
      EmpID: employee.EmpID,
      EmpName: employee.EmpName
    });
  } catch (error) {
    console.error("Error during registration:", error);

    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  const { EmployeeEmailID, password } = req.body;

  try {
    // Validate input
    if (!EmployeeEmailID || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check user credentials
    const user = await User.findOne({ EmployeeEmailID }).select('+password');
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
        email: user.EmployeeEmailID,
        usertype: user.usertype
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      token,
      user: {
        EmpID: user.EmpID,
        email: user.EmployeeEmailID,
        usertype: user.usertype,
        // employeeDetails: employee
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
