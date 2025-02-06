const express = require('express');
const mongoose = require('mongoose');
const EmpMaster = require('../models/EmpMaster');
const router = express.Router();

// Fetch Employee by EmpID
router.get('/employee/empID/:empID', async (req, res) => {
  const { empID } = req.params;
  try {
    const employee = await EmpMaster.findOne({ EmpID: empID });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found!' });
    }
    // Return the employee details including leave balances and retirement date
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee details.' });
  }
});

// Update Employee Details
router.put('/employee/empID/:empID', async (req, res) => {
  const { empID } = req.params;
  const updatedData = req.body;

  // Recalculate Retirement Date before updating
  const retirementDate = calculateRetirementDate(updatedData.BirthDate, updatedData.DateOfJoining);
  if (retirementDate) {
    updatedData.RetirementDate = retirementDate;
  }

  try {
    const employee = await EmpMaster.findOneAndUpdate(
      { EmpID: empID },
      updatedData,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found!' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee details.' });
  }
});

// Delete Employee
router.delete('/employee/empID/:empID', async (req, res) => {
  const { empID } = req.params;
  try {
    const employee = await EmpMaster.findOneAndDelete({ EmpID: empID });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found!' });
    }
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee.' });
  }
});

module.exports = router;
