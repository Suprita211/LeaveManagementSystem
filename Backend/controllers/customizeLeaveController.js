const express = require("express");
const router = express.Router();
const LeaveApplication = require("../models/LeaveApplication");
const Employee = require("../models/EmpMaster");
// const router = express.Router();

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ EmpID: req.params.employeeId });
    if (employee) {
      return res.json({ exists: true, name: employee.EmpName });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
    return res.status(500).json({ exists: false });
  }
};

const submitLeave = async (req, res) => {
  const { employeeId, leaveType } = req.body;

  try {
    // Fetch employee details
    const employee = await Employee.findOne({ EmpID: employeeId });
    if (!employee) {
      return res.status(400).json({ message: "Employee not found" });
    }

    // Create a new leave application
    const newApplication = new LeaveApplication({
      employeeId,
      leaveType,
    });

    await newApplication.save();
    res.status(200).json({
      message: `Leave application submitted successfully for ${employee.EmpName}`,
      employeeId,
      name: employee.EmpName,
    });
  } catch (error) {
    console.error("Error submitting leave application:", error);
    res.status(500).json({ message: "Error submitting leave application" });
  }
};

const leaveRecords = async (req, res) => {
  try {
    // Fetch all employees from EmpMaster collection
    const employees = await Employee.find({}, "EmpID EmpName ML PL CL");

    // Format the data to include PL timesTaken & daysTaken
    const formattedRecords = employees.map((employee) => ({
      EmpID: employee.EmpID,
      EmpName: employee.EmpName,
      ML: employee.ML,
      PL: {
        timesTaken: employee.PL?.timesTaken || 0,
        daysTaken: employee.PL?.daysTaken || 0,
      },
      CL: employee.CL,
    }));

    res.json(formattedRecords);
  } catch (err) {
    console.error("Error fetching leave records:", err);
    res.status(500).send("Failed to fetch leave records.");
  }
};

module.exports = {
  getEmployee,
  submitLeave,
  leaveRecords,
};
