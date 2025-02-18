require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import the Admin model
const Employee=require('../models/EmpMaster');
const router = express.Router();
// -----------------------------------------------

const nodemailer = require('nodemailer');

// Email Configuration (Use Your Credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'groupproject366@gmail.com', // Replace with your email
    pass: 'nmjx gxfs pxrb kobx'  // Use app password if 2FA is enabled
  }
});

// Send Notification Email
// router.post('/send-notification', async (req, res) => {
//   try {
//     const {
//       employeeId,
//       employeeName,
//       leaveType,
//       fromDate,
//       toDate,
//       numOfDays,
//       reason,
//       designation,
//       reportingHeadSignature,
//       reportingHeadReason,
//       sanctioningAuthoritySignature,
//       sanctioningAuthorityReason
//     } = req.body;

//     // Ensure required fields are present
//     if (!employeeId || !employeeName || !leaveType || !fromDate || !toDate) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
//     const employee = await Employee.findOne({ EmpID: employeeId });

//     if (!employee) {
//       return res.status(404).json({ message: `Employee not found for ID: ${employeeId}` });
//     }

//     const companyName = employee.CompanyName || 'N/A'; // Get Company Name


//     const mailOptions = {
//       from: 'groupproject366@gmail.com',
//       to: 'suprita2026@gmail.com',
//       subject: 'Leave Request Update Notification',
//       html: `
//         <div style="max-width: 600px; margin: auto; padding: 20px; border: 2px solid #333; border-radius: 10px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
//           <h2 style="text-align: center; color: #333;">Leave Request Update</h2>
//            <p style="text-align: center; font-size: 16px; font-weight: bold; color: #007bff;"> ${companyName}</p>
//           <table style="width: 100%; border-collapse: collapse;">
//             <tr><td style="padding: 10px; width: 50%;"><strong>Employee ID:</strong> ${employeeId}</td>
//                 <td style="padding: 10px; width: 50%;"><strong>Employee Name:</strong> ${employeeName}</td></tr>
//             <tr><td style="padding: 10px;"><strong>Leave Type:</strong> ${leaveType}</td>
//                 <td style="padding: 10px;"><strong>Designation:</strong> ${designation}</td></tr>
//             <tr><td style="padding: 10px;"><strong>From Date:</strong> ${fromDate}</td>
//                 <td style="padding: 10px;"><strong>To Date:</strong> ${toDate}</td></tr>
//             <tr><td style="padding: 10px;"><strong>Number of Days:</strong> ${numOfDays}</td>
//                 <td style="padding: 10px;"><strong>Reason:</strong> ${reason}</td></tr>
//           </table>
          
//           <h3 style="margin-top: 20px; border-bottom: 2px solid #333; padding-bottom: 5px;">Reporting Head</h3>
//           <table style="width: 100%; border-collapse: collapse;">
//             <tr><td style="padding: 10px; width: 50%;"><strong>Signature:</strong> ${reportingHeadSignature || 'N/A'}</td>
//                 <td style="padding: 10px; width: 50%;"><strong>Reason:</strong> ${reportingHeadReason || 'N/A'}</td></tr>
//           </table>

//           <h3 style="margin-top: 20px; border-bottom: 2px solid #333; padding-bottom: 5px;">Sanctioning Authority</h3>
//           <table style="width: 100%; border-collapse: collapse;">
//             <tr><td style="padding: 10px; width: 50%;"><strong>Signature:</strong> ${sanctioningAuthoritySignature || 'N/A'}</td>
//                 <td style="padding: 10px; width: 50%;"><strong>Reason:</strong> ${sanctioningAuthorityReason || 'N/A'}</td></tr>
//           </table>

//           <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #555;">This is an automated notification. Please do not reply.</p>
//         </div>
//       `
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Notification email sent successfully' });

//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ message: 'Error sending email', error });
//   }
// });

router.post('/send-notification', async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      leaveType,
      fromDate,
      toDate,
      numOfDays,
      reason,
      designation,
      reportingHeadSignature,
      reportingHeadReason,
      sanctioningAuthoritySignature,
      sanctioningAuthorityReason
    } = req.body;

    if (!employeeId || !employeeName || !leaveType || !fromDate || !toDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const employee = await Employee.findOne({ EmpID: employeeId });
    if (!employee) {
      return res.status(404).json({ message: `Employee not found for ID: ${employeeId}` });
    }

    const companyName = employee.CompanyName || 'N/A';

    const mailOptions = {
      from: 'groupproject366@gmail.com',
      to: 'it.pioneergeoscience@gmail.com',
      subject: 'Leave Request Update Notification',
      html: `
        <div style="max-width: 600px; margin: auto; padding: 10px; border: 1px solid #333; font-family: Arial, sans-serif; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #333; margin: 5px 0;">Leave Request Update</h2>
          <p style="text-align: center; font-size: 14px; font-weight: bold; color: #007bff; margin: 5px 0;">${companyName}</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr><td><strong>ID:</strong> ${employeeId}</td><td><strong>Name:</strong> ${employeeName}</td></tr>
            <tr><td><strong>Type:</strong> ${leaveType}</td><td><strong>Designation:</strong> ${designation}</td></tr>
            <tr><td><strong>From:</strong> ${fromDate}</td><td><strong>To:</strong> ${toDate}</td></tr>
            <tr><td><strong>Days:</strong> ${numOfDays}</td><td><strong>Reason:</strong> ${reason}</td></tr>
          </table>
          <h4 style="margin: 5px 0; border-bottom: 1px solid #333;">Reporting Head</h4>
          <table style="width: 100%; font-size: 12px;">
            <tr><td><strong>Sign:</strong> ${reportingHeadSignature || 'N/A'}</td><td><strong>Reason:</strong> ${reportingHeadReason || 'N/A'}</td></tr>
          </table>
          <h4 style="margin: 5px 0; border-bottom: 1px solid #333;">Sanctioning Authority</h4>
          <table style="width: 100%; font-size: 12px;">
            <tr><td><strong>Sign:</strong> ${sanctioningAuthoritySignature || 'N/A'}</td><td><strong>Reason:</strong> ${sanctioningAuthorityReason || 'N/A'}</td></tr>
          </table>
          <p style="text-align: center; font-size: 10px; color: #555; margin: 5px 0;">This is an automated notification. Please do not reply.</p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Notification email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
});





// -------------------------------------------------
// Admin Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { adminId, email, password, designation } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({ adminId, email, password: hashedPassword, designation });
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
});

// Admin Login Route
router.post('/login', async (req, res) => {
    try {
        console.log("Login request received:", req.body); // Log request data

        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log("Admin not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log("Password incorrect");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { adminId: admin.adminId, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Login successful");
        res.json({ token, admin: { adminId: admin.adminId, email: admin.email, designation: admin.designation } });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});
// router.get('/email', async (req, res) => {
//     try {
//       const admin = await Admin.findById(req.admin.id);
//        // Ensure `req.admin` is set in authentication middleware
//       res.json({ email: admin.email });
//     } catch (error) {
//       console.error('Error fetching admin email:', error);
//       res.status(500).json({ message: 'Error fetching admin email' });
//     }
//   });
  



module.exports = router;
