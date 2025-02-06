// Employee Routes (employeeRoutes.js)
const express = require('express');
const EmpMaster = require('../models/EmpMaster'); // Employee model
const Counter = require('../models/Counter');
const router = express.Router();

// Employee ID Generation Logic

// POST request to store employee data
router.post('/', async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Received employee data:', req.body);

    // Fetch and update the counter for EmpID generation
    const counter = await Counter.findOneAndUpdate(
      { name: 'empID' },
      { $inc: { value: 1 } },  // Increment the counter by 1
      { new: true, upsert: true } // Create a new counter if it doesn't exist
    );

    // Generate the new EmpID based on the current counter value
    const newEmpID = counter.value.toString().padStart(4, '0'); // Format as 4 digits

    // Prepare the employee data with the generated EmpID
    const employeeData = { ...req.body, EmpID: newEmpID };

    // Create and save the new employee record in the database
    const newEmployee = new EmpMaster(employeeData);
    const savedEmployee = await newEmployee.save();

    // Return the saved employee data as a response
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error storing employee:', error);
    res.status(500).json({ error: 'Failed to store employee data', details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const employees = await EmpMaster.find({}, '-_id -__v'); // Exclude MongoDB internal fields

    const formattedEmployees = employees.map(emp => ({
      ...emp._doc,
      DateOfJoining: emp.DateOfJoining ? emp.DateOfJoining.toISOString().split('T')[0] : '',
      BirthDate: emp.BirthDate ? emp.BirthDate.toISOString().split('T')[0] : '',
      RetirementDate: emp.RetirementDate ? emp.RetirementDate.toISOString().split('T')[0] : '',
      Department: emp.Department || '',               // New field for Department
      EmployeeEmailID: emp.EmployeeEmailID || '',     // New field for Employee Email ID
      AadharNumber: emp.AadharNumber || '',           // New field for Aadhar Number
      PANNumber: emp.PANNumber || '',                 // New field for PAN Number
      CL: emp.CL || 0,                                // Default to 0 if undefined
      ML: emp.ML || 0,                                // Default to 0 if undefined
      PL_timesTaken: emp.PL ? emp.PL.timesTaken : 0,   // Changed SL to PL (Privilege Leave)
      PL_daysTaken: emp.PL ? emp.PL.daysTaken : 0,     // Changed SL to PL (Privilege Leave)
    }));

    res.status(200).json(formattedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.put('/empID/:empID', async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Ensure date fields are formatted properly before updating
    if (updateData.DateOfJoining) {
      updateData.DateOfJoining = new Date(updateData.DateOfJoining);
    }
    if (updateData.BirthDate) {
      updateData.BirthDate = new Date(updateData.BirthDate);
    }
    if (updateData.RetirementDate) {
      updateData.RetirementDate = new Date(updateData.RetirementDate);
    }

    // Handle the logic for calculating RetirementDate based on BirthDate or DateOfJoining
    if (updateData.BirthDate) {
      const birthDate = new Date(updateData.BirthDate);
      if (!isNaN(birthDate.getTime())) {
        const retirementFromBirth = new Date(birthDate);
        retirementFromBirth.setFullYear(retirementFromBirth.getFullYear() + 60);

        // Check if retirement date should be the last day of the month or first
        const lastDayOfMonth = new Date(retirementFromBirth.getFullYear(), retirementFromBirth.getMonth() + 1, 0);
        const firstDayOfMonth = new Date(retirementFromBirth.getFullYear(), retirementFromBirth.getMonth(), 1);

        if (retirementFromBirth.getDate() >= 2 && retirementFromBirth.getDate() <= lastDayOfMonth.getDate()) {
          // Between second and last day of the month, set to last day of the month
          updateData.RetirementDate = lastDayOfMonth;
        } else {
          // Otherwise, set to first day of the month
          updateData.RetirementDate = firstDayOfMonth;
        }
      }
    }

    if (updateData.DateOfJoining) {
      const doj = new Date(updateData.DateOfJoining);
      if (!isNaN(doj.getTime())) {
        const retirementFromDOJ = new Date(doj);
        retirementFromDOJ.setFullYear(retirementFromDOJ.getFullYear() + 40);

        // Check if retirement date should be the last day of the month or first
        const lastDayOfMonth = new Date(retirementFromDOJ.getFullYear(), retirementFromDOJ.getMonth() + 1, 0);
        const firstDayOfMonth = new Date(retirementFromDOJ.getFullYear(), retirementFromDOJ.getMonth(), 1);

        if (retirementFromDOJ.getDate() >= 2 && retirementFromDOJ.getDate() <= lastDayOfMonth.getDate()) {
          // Between second and last day of the month, set to last day of the month
          updateData.RetirementDate = lastDayOfMonth;
        } else {
          // Otherwise, set to first day of the month
          updateData.RetirementDate = firstDayOfMonth;
        }
      }
    }

    // Find and update employee by EmpID
    const updatedEmployee = await EmpMaster.findOneAndUpdate(
      { EmpID: req.params.empID }, // Search by EmpID
      updateData, // Updated fields
      { new: true, runValidators: true } // Return the updated record & apply validation
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

router.delete('/empID/:empID', async (req, res) => {
  try {
    const deletedEmployee = await EmpMaster.findOneAndDelete({ EmpID: req.params.empID });

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully', deletedEmployee });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const employees = await EmpMaster.find({}, '-_id -__v'); // Exclude MongoDB internal fields

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    // Format dates for consistency
    const formattedEmployees = employees.map(emp => ({
      ...emp._doc,
      DateOfJoining: emp.DateOfJoining ? emp.DateOfJoining.toISOString().split('T')[0] : '',
      BirthDate: emp.BirthDate ? emp.BirthDate.toISOString().split('T')[0] : '',
      RetirementDate: emp.RetirementDate ? emp.RetirementDate.toISOString().split('T')[0] : '',
      CL: emp.CL || 0,  // Default to 0 if undefined
      ML: emp.ML || 0,  // Default to 0 if undefined
      PL_timesTaken: emp.PL ? emp.PL.timesTaken : 0, // Changed SL to PL (Privilege Leave)
      PL_daysTaken: emp.PL ? emp.PL.daysTaken : 0,  // Changed SL to PL (Privilege Leave)
    }));

    res.status(200).json(formattedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

module.exports = router;
