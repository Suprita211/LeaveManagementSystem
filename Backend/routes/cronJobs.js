// const cron = require('node-cron');
// const LeaveRequest = require('../models/customizeLeave'); // Leave schema
// const EmpMaster = require('../models/EmpMaster'); // Employee schema
// const nodemailer = require('nodemailer');
// const path = require('path');
// const fs = require('fs');

// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'groupproject366@gmail.com',
//     pass: 'nmjx gxfs pxrb kobx',
//   },
// });

// // Schedule: Runs every minute
// cron.schedule('* * * * *', async () => {
//   console.log('⏳ Checking for leave requests that need a 5-minute notification...');

//   try {
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // Current time - 5 minutes

//     // Find leave requests that are pending, older than 5 minutes, and not yet notified
//     const pendingRequests = await LeaveRequest.find({
//       approvalStatus: 'Pending',
//       createdAt: { $lte: fiveMinutesAgo }, 
//       notified: false, 
//     });

//     if (pendingRequests.length === 0) {
//       console.log('✅ No pending leave requests requiring notification.');
//       return;
//     }

//     for (const request of pendingRequests) {
//       console.log(`🔍 Processing Leave Request ID: ${request._id} (Employee ID: ${request.employeeId})`);

//       // Fetch employee details
//       const employee = await EmpMaster.findOne({ EmpID: request.employeeId });

//       if (!employee || !employee.EmployeeEmailID) {
//         console.warn(`⚠️ Employee email not found (EmpID: ${request.employeeId})`);
//         continue;
//       }

//       console.log(`📧 Employee Email Found: ${employee.EmployeeEmailID}`);

//       // --- Email Content ---
//       const leaveDetails = `
//         Leave Details:
//         - Leave Type: ${request.leaveType}
//         - From: ${request.fromDate.toDateString()}
//         - To: ${request.toDate.toDateString()}
//         - Number of Days: ${request.numOfDays}
//         - Reason: ${request.reason}
//       `;

//       const employeeEmailBody = `
//         Reminder: Your leave request is still pending approval.

//         ${leaveDetails}

//         Please follow up with your reporting authority if required.
//       `;

//       const adminEmailBody = `
//         Employee ID: ${request.employeeId} has a pending leave request.

//         ${leaveDetails}

//         Please review and take necessary action.
//       `;

//       // --- Handling Attachments ---
//       let attachmentFiles = [];
//       if (request.attachments && request.attachments.length > 0) {
//         request.attachments.forEach((file) => {
//           const filePath = path.join(__dirname, '../uploads', path.basename(file));
          
//           if (fs.existsSync(filePath)) {
//             attachmentFiles.push({
//               filename: path.basename(filePath),
//               path: filePath,
//             });
//           } else {
//             console.warn(`⚠️ Attachment not found: ${filePath}`);
//           }
//         });
//       }

//       // Send email to Employee
//       await transporter.sendMail({
//         from: 'groupproject366@gmail.com',
//         to: employee.EmployeeEmailID,
//         subject: '🔔 Reminder: Your Leave Request is Pending',
//         text: employeeEmailBody,
//         attachments: attachmentFiles.length > 0 ? attachmentFiles : [], // Attach files if present
//       });

//       console.log(`📩 Employee notification sent for Leave Request ID: ${request._id}`);

//       // Send email to Admin
//       await transporter.sendMail({
//         from: 'groupproject366@gmail.com',
//         to: 'groupproject366@gmail.com', // Admin email
//         subject: `🔔 Reminder: ${request.employeeId} Leave Request Pending`,
//         text: adminEmailBody,
//         attachments: attachmentFiles.length > 0 ? attachmentFiles : [], // Attach files if present
//       });

//       console.log(`📩 Admin notification sent for Leave Request ID: ${request._id}`);

//       // Mark request as notified
//       await LeaveRequest.updateOne({ _id: request._id }, { notified: true });
//     }
//   } catch (error) {
//     console.error('❌ Error in cron job:', error);
//   }
// });


const cron = require('node-cron');
const LeaveRequest = require('../models/customizeLeave'); // Leave schema
const EmpMaster = require('../models/EmpMaster'); // Employee schema
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'groupproject366@gmail.com',
    pass: 'nmjx gxfs pxrb kobx',
  },
});

// Schedule: Runs every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('⏳ Checking for leave requests that need a 3-day notification...');

  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // Current time - 3 days

    // Find leave requests that are pending, older than 3 days, and not yet notified
    const pendingRequests = await LeaveRequest.find({
      approvalStatus: 'Pending',
      createdAt: { $lte: threeDaysAgo }, 
      notified: false, 
    });

    if (pendingRequests.length === 0) {
      console.log('✅ No pending leave requests requiring notification.');
      return;
    }

    for (const request of pendingRequests) {
      console.log(`🔍 Processing Leave Request ID: ${request._id} (Employee ID: ${request.employeeId})`);

      // Fetch employee details
      const employee = await EmpMaster.findOne({ EmpID: request.employeeId });

      if (!employee || !employee.EmployeeEmailID) {
        console.warn(`⚠️ Employee email not found (EmpID: ${request.employeeId})`);
        continue;
      }

      console.log(`📧 Employee Email Found: ${employee.EmployeeEmailID}`);

      // --- Email Content ---
      const leaveDetails = `
        Leave Details:
        - Leave Type: ${request.leaveType}
        - From: ${request.fromDate.toDateString()}
        - To: ${request.toDate.toDateString()}
        - Number of Days: ${request.numOfDays}
        - Reason: ${request.reason}
      `;

      const employeeEmailBody = `
        Reminder: Your leave request has been pending for more than 3 days.

        ${leaveDetails}

        Please follow up with your reporting authority if required.
      `;

      const adminEmailBody = `
        Employee ID: ${request.employeeId} has a pending leave request for more than 3 days.

        ${leaveDetails}

        Please review and take necessary action.
      `;

      // --- Handling Attachments ---
      let attachmentFiles = [];
      if (request.attachments && request.attachments.length > 0) {
        request.attachments.forEach((file) => {
          const filePath = path.join(__dirname, '../uploads', path.basename(file));
          
          if (fs.existsSync(filePath)) {
            attachmentFiles.push({
              filename: path.basename(filePath),
              path: filePath,
            });
          } else {
            console.warn(`⚠️ Attachment not found: ${filePath}`);
          }
        });
      }

      // Send email to Employee
      await transporter.sendMail({
        from: 'groupproject366@gmail.com',
        to: employee.EmployeeEmailID,
        subject: '🔔 Reminder: Your Leave Request is Pending for 3+ Days',
        text: employeeEmailBody,
        attachments: attachmentFiles.length > 0 ? attachmentFiles : [], // Attach files if present
      });

      console.log(`📩 Employee notification sent for Leave Request ID: ${request._id}`);

      // Send email to Admin
      await transporter.sendMail({
        from: 'groupproject366@gmail.com',
        to: 'groupproject366@gmail.com', // Admin email
        subject: `🔔 Reminder: ${request.employeeId} Leave Request Pending for 3+ Days`,
        text: adminEmailBody,
        attachments: attachmentFiles.length > 0 ? attachmentFiles : [], // Attach files if present
      });

      console.log(`📩 Admin notification sent for Leave Request ID: ${request._id}`);

      // Mark request as notified
      await LeaveRequest.updateOne({ _id: request._id }, { notified: true });
    }
  } catch (error) {
    console.error('❌ Error in cron job:', error);
  }
});

