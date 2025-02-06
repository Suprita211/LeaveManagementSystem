const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Employee = require('../models/EmpMaster'); // Correct model import
// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'groupproject366@gmail.com',   // Your Gmail address
    pass: 'nmjx gxfs pxrb kobx',      // Your app-specific password generated from Gmail 2FA
  },
});

// Function to send email to admin when a leave request is submitted
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0'); // Add leading zero if day is less than 10
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Get month (0-11) and add 1 to match 1-12
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const sendLeaveRequestNotification = async (leaveRequest, leaveBalance) => {
  const adminEmail = 'groupproject366@gmail.com';

  const formattedFromDate = formatDate(leaveRequest.fromDate);
  const formattedToDate = formatDate(leaveRequest.toDate);

  // Get available leave balance based on the leave type
  let leaveBalanceHtml = '';
  if (leaveRequest.leaveType === 'CL') {
    leaveBalanceHtml = `<p><strong>Available Casual Leave (CL):</strong> ${leaveBalance.CL}</p>`;
  } else if (leaveRequest.leaveType === 'ML') {
    leaveBalanceHtml = `<p><strong>Available Medical Leave (ML):</strong> ${leaveBalance.ML}</p>`;
  } else if (leaveRequest.leaveType === 'SL') {
    leaveBalanceHtml = `
      <p><strong>Sick Leave (SL) Details:</strong></p>
      <ul>
        <li><strong>Days Taken:</strong> ${leaveBalance.SL.daysTaken}</li>
        <li><strong>Times Taken:</strong> ${leaveBalance.SL.timesTaken}</li>
      </ul>
    `;
  }

  const mailOptions = {
    from: 'suprita213@gmail.com',
    to: adminEmail,
    subject: 'New Leave Request',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #2e6da4;">New Leave Request</h2>
            <div style="border: 2px solid #007bff; padding: 20px; border-radius: 5px; margin-top: 20px;">
              <p><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>
              <p><strong>Employee ID:</strong> ${leaveRequest.employeeId}</p>
              <p><strong>Employee Name:</strong> ${leaveRequest.name}</p>
              <p><strong>Designation:</strong> ${leaveRequest.designation}</p>
              <p><strong>Period:</strong> 
                <span><strong>From:</strong> ${formattedFromDate}</span>
                <span style="margin-left: 20px;"><strong>To:</strong> ${formattedToDate}</span>
              </p>
              <p><strong>Number of Days:</strong> ${leaveRequest.numOfDays}</p>
              <p><strong>Reason for Leave:</strong> ${leaveRequest.reason}</p>
              ${leaveBalanceHtml}
              <div style="margin-top: 20px;">
                ${leaveRequest.attachments && leaveRequest.attachments.length > 0
                  ? `<p><strong>Attachments:</strong> ${leaveRequest.attachments.map(file => {
                      const fileName = file.split('/').pop(); // Get only the file name
                      return `<a href="${file}" target="_blank">${fileName}</a>`;
                    }).join(', ')}</p>`
                  : `<p><strong>Attachments:</strong> None</p>`
                }
              </div>
            </div>
            <div style="margin-top: 20px; padding: 10px; background-color: #f1f1f1; border-radius: 5px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #888;">Please review the leave request.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    attachments: leaveRequest.attachments
      ? leaveRequest.attachments.map(file => ({
          filename: file.split('/').pop(), // Attach only file name
          path: file
        }))
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Leave request notification sent!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


// Function to send email to employee on leave request approval/rejection

// const sendLeaveDecisionNotification = async (leaveRequest) => {
//   const adminEmail = 'groupproject366@gmail.com';

//   const formattedFromDate = formatDate(leaveRequest.fromDate);
//   const formattedToDate = formatDate(leaveRequest.toDate);

//   // Find the employee details by EmpID
//   const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });

//   if (!employee) {
//     console.error('Employee not found!');
//     return; // Exit if employee is not found
//   }

//   const employeeEmail = employee.EmployeeEmailID; // Get employee email from the employee record
//   const department=employee.Department;

//   let remainingBalance = 'N/A';
//   if (employee) {
//     switch (leaveRequest.leaveType) {
//       case 'CL':
//         remainingBalance = employee.CL;
//         break;
//       case 'ML':
//         remainingBalance = employee.ML;
//         break;
//       case 'SL':
//         remainingBalance = '';  // No remaining balance for Sick Leave
//         break;
//     }
//   }

//   const mailOptions = {
//     from: 'suprita213@gmail.com',
//     to: employeeEmail,  // Send the email to the employee's email
//     subject: `Leave Request ${leaveRequest.approvalStatus}`,
//     html: `
//    <html>
//   <body style="font-family: Arial, sans-serif; padding: 10px; background-color: #f9f9f9;">
//     <div style="max-width: 650px; margin: auto; background-color: #ffffff; padding: 5px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      
//       <!-- Outer container for the slip -->
//       <div style="border: 2px solid #007bff; padding: 5px; border-radius: 8px; width: 100%;"> 

//         <!-- Title inside the slip -->
//         <h2 style="text-align: center; color: #2e6da4; margin-bottom: 5px;">Leave Application Form</h2>

//         <!-- Leave Type -->
//         <p style="font-size: 16px; font-weight: bold; margin: 0;"><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>

//         <!-- Employee Details (Employee ID and Name in the same line) -->
//         <div style="display: flex; justify-content: space-between; margin: 0;">
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Employee ID:</strong> ${leaveRequest.employeeId}</p></div>
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Employee Name:</strong> ${leaveRequest.name}</p></div>
//         </div>

//         <!-- Department and Designation (In the same line) -->
//         <div style="display: flex; justify-content: space-between; margin: 0;">
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Department:</strong> ${department}</p></div>
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Designation:</strong> ${leaveRequest.designation}</p></div>
//         </div>

//         <!-- Period of Leave (From and To in the same line) -->
//         <div style="display: flex; justify-content: space-between; margin: 0;">
//           <div style="width: 48%;"><p style="margin: 0;"><strong>From:</strong> ${formattedFromDate}</p></div>
//           <div style="width: 48%;"><p style="margin: 0;"><strong>To:</strong> ${formattedToDate}</p></div>
//         </div>

//         <!-- Number of Days and Available Balance (In the same line for CL and ML only) -->
//         <div style="display: flex; justify-content: space-between; margin: 0;">
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Number of Days:</strong> ${leaveRequest.numOfDays}</p></div>
//           ${leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML' 
//             ? `<div style="width: 48%;"><p style="margin: 0;"><strong>Available Balance:</strong> ${remainingBalance}</p></div>` 
//             : ''}
//         </div>

//         <!-- Reason for Leave -->
//         <p style="font-size: 16px; font-weight: bold; margin: 0;"><strong>Reason for Leave:</strong> ${leaveRequest.reason}</p>

//         <!-- Approved with Remarks Section -->
//         <h4 style="margin: 10px 0 5px;">Approved with Remarks:</h4> <!-- Added some space below the title -->
//         <div style="display: flex; justify-content: space-between; margin: 0;">
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Reporting Head Signature:</strong> ${leaveRequest.reportingHeadSignature || 'Not Provided'}</p></div>
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Comment:</strong> ${leaveRequest.reportingHeadReason || 'Not Provided'}</p></div>
//         </div>
//         <div style="display: flex; justify-content: space-between; margin: 0;">
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Sanctioning Authority Signature:</strong> ${leaveRequest.sanctioningAuthoritySignature || 'Not Provided'}</p></div>
//           <div style="width: 48%;"><p style="margin: 0;"><strong>Comment:</strong> ${leaveRequest.sanctioningAuthorityReason || 'Not Provided'}</p></div>
//         </div>

//         <!-- Attachments Section -->
//         <div style="margin-top: 5px;">
//           ${leaveRequest.attachments && leaveRequest.attachments.length > 0
//             ? `<p style="margin: 0;"><strong>Attachments:</strong> ${leaveRequest.attachments.map(file => `<a href="${file}" target="_blank">${file}</a>`).join(', ')}</p>`
//             : `<p style="margin: 0;"><strong>Attachments:</strong> None</p>`}
//         </div>

//       </div>

//       <!-- Footer message -->
//       <div style="margin-top: 5px; padding: 5px; background-color: #f1f1f1; border-radius: 5px; text-align: center;">
//         <p style="margin: 0; font-size: 12px; color: #888;">Your leave request has been ${leaveRequest.approvalStatus}. Please review the decision.</p>
//       </div>
//     </div>
//   </body>
// </html>


//     `,
//     attachments: leaveRequest.attachments ? leaveRequest.attachments.map(file => ({
//       filename: file.split('/').pop(),
//       path: file
//     })) : [],
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Leave decision notification sent!');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// const sendLeaveDecisionNotification = async (leaveRequest) => {
//   const formattedFromDate = formatDate(leaveRequest.fromDate);
//   const formattedToDate = formatDate(leaveRequest.toDate);

//   const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });
//   if (!employee) {
//     console.error('Employee not found!');
//     return;
//   }

//   const employeeEmail = employee.EmployeeEmailID;
//   const department = employee.Department;

//   let remainingBalance = 'N/A';
//   if (employee) {
//     switch (leaveRequest.leaveType) {
//       case 'CL':
//         remainingBalance = employee.CL;
//         break;
//       case 'ML':
//         remainingBalance = employee.ML;
//         break;
//       case 'SL':
//         remainingBalance = '';
//         break;
//     }
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 470], margin: 30 }); // Custom slip size
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   // Border Box for Slip
//   doc.rect(30, 30, 540, 370).stroke('#007bff');

//   // Title Inside the Border Box
//   doc.fontSize(18).fillColor('#2e6da4')
//     .text('Leave Application Form', 30, 55, { width: 540, align: 'center' })
//     .moveDown(0.5);

//   // Leave Type
//   doc.fontSize(12).fillColor('black').text(`Leave Type: ${leaveRequest.leaveType}`, 40, 90);

//   // Employee Details
//   doc.fontSize(10)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, 40, 110)
//     .text(`Employee Name: ${leaveRequest.name}`, 280, 110);

//   doc.text(`Department: ${department}`, 40, 130)
//     .text(`Designation: ${leaveRequest.designation}`, 280, 130);

//   // Leave Duration
//   doc.text(`From: ${formattedFromDate}`, 40, 150)
//     .text(`To: ${formattedToDate}`, 280, 150);

//   // Number of Days & Balance
//   doc.text(`Days: ${leaveRequest.numOfDays}`, 40, 170);
//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, 280, 170);
//   }

//   // Reason for Leave
//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', 40, 190);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, 40, 205, { width: 500 });

//   // Approval Remarks
//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', 40, 230);
//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, 40, 245)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, 280, 245)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, 40, 265)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, 280, 265);

//   // Attachments
//   doc.moveDown(0.5);
//   doc.fontSize(10).fillColor('#2e6da4').text('Attachments:', 40, 290);
//   doc.fillColor('black');
//   if (leaveRequest.attachments && leaveRequest.attachments.length > 0) {
//     doc.text(leaveRequest.attachments.map(file => file.split('/').pop()).join(', '), 100, 290);
//   } else {
//     doc.text('None', 100, 290);
//   }

//   // Footer Message
//   doc.moveDown(1);
//   doc.fontSize(10).fillColor('#888')
//     .text(`Leave request ${leaveRequest.approvalStatus}`, { align: 'center' });

//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: employeeEmail,
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
//         ...(leaveRequest.attachments
//           ? leaveRequest.attachments.map(file => ({
//               filename: file.split('/').pop(),
//               path: file,
//             }))
//           : []),
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Leave decision notification sent with PDF attachment!');

//       // Delete PDF after sending
//       fs.unlink(pdfPath, (err) => {
//         if (err) console.error('Error deleting PDF:', err);
//       });

//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   });
// };


// const sendLeaveDecisionNotification = async (leaveRequest) => {
//   const formattedFromDate = formatDate(leaveRequest.fromDate);
//   const formattedToDate = formatDate(leaveRequest.toDate);

//   const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });
//   if (!employee) {
//     console.error('Employee not found!');
//     return;
//   }

//   const employeeEmail = employee.EmployeeEmailID;
//   const department = employee.Department;

//   let remainingBalance = 'N/A';
//   if (employee) {
//     switch (leaveRequest.leaveType) {
//       case 'CL':
//         remainingBalance = employee.CL;
//         break;
//       case 'ML':
//         remainingBalance = employee.ML;
//         break;
//       case 'SL':
//         remainingBalance = '';
//         break;
//     }
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 280], margin: 30 }); // Reduced overall height
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   // Border Box for Slip (Reduced height to remove bottom space)
//   doc.rect(30, 30, 540, 220).stroke('#007bff'); // Adjusted height to fit content

//   // Title - Moved Up to Remove Top Space
//   doc.fontSize(16).fillColor('#2e6da4')
//     .text('Leave Application Form', 30, 35, { width: 540, align: 'center' });

//   // Leave Type
//   doc.fontSize(12).fillColor('black').text(`Leave Type: ${leaveRequest.leaveType}`, 40, 55);

//   // Employee Details
//   doc.fontSize(10)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, 40, 75)
//     .text(`Employee Name: ${leaveRequest.name}`, 280, 75)
//     .text(`Department: ${department}`, 40, 95)
//     .text(`Designation: ${leaveRequest.designation}`, 280, 95);

//   // Leave Duration
//   doc.text(`From: ${formattedFromDate}`, 40, 115)
//     .text(`To: ${formattedToDate}`, 280, 115);

//   // Number of Days & Balance
//   doc.text(`Days: ${leaveRequest.numOfDays}`, 40, 135);
//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, 280, 135);
//   }

//   // Reason for Leave
//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', 40, 155);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, 40, 170, { width: 500 });

//   // Approval Remarks
//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', 40, 190);
//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, 40, 205)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, 280, 205)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, 40, 225)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, 280, 225);

//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: employeeEmail,
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
//         ...(leaveRequest.attachments
//           ? leaveRequest.attachments.map(file => ({
//               filename: file.split('/').pop(),
//               path: file,
//             }))
//           : []),
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Leave decision notification sent with PDF attachment!');

//       // Delete PDF after sending
//       fs.unlink(pdfPath, (err) => {
//         if (err) console.error('Error deleting PDF:', err);
//       });

//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   });
// };


const sendLeaveDecisionNotification = async (leaveRequest) => {
  const formattedFromDate = formatDate(leaveRequest.fromDate);
  const formattedToDate = formatDate(leaveRequest.toDate);

  const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });
  if (!employee) {
    console.error('Employee not found!');
    return;
  }

  const employeeEmail = employee.EmployeeEmailID;
  const department = employee.Department;

  let remainingBalance = 'N/A';
  if (employee) {
    switch (leaveRequest.leaveType) {
      case 'CL':
        remainingBalance = employee.CL;
        break;
      case 'ML':
        remainingBalance = employee.ML;
        break;
      case 'SL':
        remainingBalance = '';
        break;
    }
  }

  // Generate PDF
  const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
  const doc = new PDFDocument({ size: [600, 295], margin: 30 }); // Slightly increased height
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Border Box for Slip
  doc.rect(30, 30, 540, 235).stroke('#007bff'); // Adjusted height

  // Title - PIONEER GROUP (Bold, Italic, Centered)
  doc.font('Helvetica-BoldOblique') // Bold & Italic
    .fontSize(16).fillColor('#2e6da4')
    .text('PIONEER GROUP', 30, 35, { width: 540, align: 'center' });

  // Leave Application Form Title with Space Below
  doc.font('Helvetica-Bold') // Regular Bold
    .fontSize(16).fillColor('#2e6da4')
    .text('Leave Application Form', 30, 55, { width: 540, align: 'center' });

  doc.moveDown(0.5); // Adds space below Leave Application Form

  // Leave Type
  doc.fontSize(12).fillColor('black').text(`Leave Type: ${leaveRequest.leaveType}`, 40, 75);

  // Employee Details
  doc.fontSize(10)
    .text(`Employee ID: ${leaveRequest.employeeId}`, 40, 95)
    .text(`Employee Name: ${leaveRequest.name}`, 280, 95)
    .text(`Department: ${department}`, 40, 115)
    .text(`Designation: ${leaveRequest.designation}`, 280, 115);

  // Leave Duration
  doc.text(`From: ${formattedFromDate}`, 40, 135)
    .text(`To: ${formattedToDate}`, 280, 135);

  // Number of Days & Balance
  doc.text(`Number of Days: ${leaveRequest.numOfDays}`, 40, 155);
  if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
    doc.text(`Remaining Balance: ${remainingBalance}`, 280, 155);
  }

  // Reason for Leave
  doc.fontSize(12).fillColor('#2e6da4').text('Reason:', 40, 175);
  doc.fontSize(10).fillColor('black').text(leaveRequest.reason, 40, 190, { width: 500 });

  // Approval Remarks with Extra Space Below Heading
  doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', 40, 210);
  doc.moveDown(0.5); // Adds a little extra space below "Approval Remarks"

  doc.fontSize(10).fillColor('black')
    .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, 40, 225)
    .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, 280, 225)
    .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, 40, 245)
    .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, 280, 245);

  doc.end();

  writeStream.on('finish', async () => {
    const mailOptions = {
      from: 'suprita213@gmail.com',
      to: employeeEmail,
      subject: `Leave Request ${leaveRequest.approvalStatus}`,
      text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
      attachments: [
        {
          filename: `leave_request_${leaveRequest.employeeId}.pdf`,
          path: pdfPath,
        },
        ...(leaveRequest.attachments
          ? leaveRequest.attachments.map(file => ({
              filename: file.split('/').pop(),
              path: file,
            }))
          : []),
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Leave decision notification sent with PDF attachment!');

      // Delete PDF after sending
      fs.unlink(pdfPath, (err) => {
        if (err) console.error('Error deleting PDF:', err);
      });

    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
};


module.exports = { sendLeaveRequestNotification, sendLeaveDecisionNotification };
