const express = require("express");
const router = express.Router();
const LeaveApplication = require("../models/LeaveApplication");
const Employee = require("../models/EmpMaster");
const {
  getEmployee,
  submitLeave,
  leaveRecords,
} = require("../controllers/customizeLeaveController");

// Route to fetch employee details by ID
router.get("/employee/:employeeId", getEmployee);

// Route to submit leave application
router.post("/submit-leave", submitLeave);

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

router.get("/leave-records", leaveRecords);

module.exports = router;
