const express = require('express');
const router = express.Router();
const LeaveApplication = require('../models/LeaveApplication');
const Employee = require('../models/EmpMaster');

// Route to fetch employee details by ID
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ EmpID: req.params.employeeId });
    if (employee) {
      return res.json({ exists: true, name: employee.EmpName });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ exists: false });
  }
});

// Route to submit leave application
router.post('/submit-leave', async (req, res) => {
  const { employeeId, leaveType } = req.body;

  try {
    // Fetch employee details
    const employee = await Employee.findOne({ EmpID: employeeId });
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found' });
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
    console.error('Error submitting leave application:', error);
    res.status(500).json({ message: 'Error submitting leave application' });
  }
});

// router.get('/leave-records', async (req, res) => {
//   try {
//     // Fetch all leave records from the LeaveApplication model
//     const leaveRecords = await LeaveApplication.find();

//     // For each leave record, find the corresponding employee name
//     const leaveRecordsWithNames = await Promise.all(leaveRecords.map(async (record) => {
//       try {
//         // Find the employee by EmpID in the EmpMaster collection
//         const employee = await Employee.findOne({ EmpID: record.employeeId });

//         // If the employee exists, return the leave record with employee name
//         if (employee) {
//           return {
//             ...record.toObject(), // Convert the leave record to a plain object
//             employeeName: employee.EmpName, // Add employee name
//           };
//         } else {
//           return {
//             ...record.toObject(),
//             employeeName: 'Unknown', // Default to 'Unknown' if no employee is found
//           };
//         }
//       } catch (err) {
//         console.error(`Error finding employee for ID ${record.employeeId}:`, err);
//         return {
//           ...record.toObject(),
//           employeeName: 'Error retrieving name',
//         };
//       }
//     }));

//     // Send the leave records with employee names as a JSON response
//     res.json(leaveRecordsWithNames);

//   } catch (err) {
//     console.error('Error fetching leave records:', err);
//     res.status(500).send('Failed to fetch leave records.');
//   }
// });

router.get('/leave-records', async (req, res) => {
  try {
    // Fetch all employees from EmpMaster collection
    const employees = await Employee.find({}, 'EmpID EmpName ML PL CL');

    // Format the data to include PL timesTaken & daysTaken
    const formattedRecords = employees.map(employee => ({
      EmpID: employee.EmpID,
      EmpName: employee.EmpName,
      ML: employee.ML,
      PL: {
        timesTaken: employee.PL?.timesTaken || 0,
        daysTaken: employee.PL?.daysTaken || 0
      },
      CL: employee.CL
    }));

    res.json(formattedRecords);

  } catch (err) {
    console.error('Error fetching leave records:', err);
    res.status(500).send('Failed to fetch leave records.');
  }
});


module.exports = router;
