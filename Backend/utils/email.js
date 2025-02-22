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
    pass: 'qpes wpsv pcyc lkmc',     
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



// const sendLeaveRequestNotification = async (leaveRequest, leaveBalance) => {
//   const adminEmail = 'groupproject366@gmail.com';

//   try {
//     // Fetch company name using employee ID
//     const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });

//     if (!employee) {
//       console.error(`Employee not found for ID: ${leaveRequest.employeeId}`);
//       return;
//     }

//     const companyName = employee.CompanyName; // Get Company Name
//     const formattedFromDate = formatDate(leaveRequest.fromDate);
//     const formattedToDate = formatDate(leaveRequest.toDate);

//     // Dynamically get available leave balance based on leave type
//     let leaveBalanceHtml = '';
//     if (leaveBalance[leaveRequest.leaveType]) {
//       if (typeof leaveBalance[leaveRequest.leaveType] === 'object') {
//         leaveBalanceHtml = `
//           <p><strong>${leaveRequest.leaveType} Details:</strong></p>
//           <ul>
//             ${Object.entries(leaveBalance[leaveRequest.leaveType])
//               .map(([key, value]) => `<li><strong>${key.replace(/([A-Z])/g, ' $1')}:</strong> ${value}</li>`)
//               .join('')}
//           </ul>
//         `;
//       } else {
//         leaveBalanceHtml = `<p><strong>Available ${leaveRequest.leaveType}:</strong> ${leaveBalance[leaveRequest.leaveType]}</p>`;
//       }
//     }

//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: adminEmail,
//       subject: 'New Leave Request',
//       html: `
//         <html>
//           <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
//             <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
//               <h2 style="text-align: center; color: #2e6da4;">New Leave Request</h2>
//               <div style="border: 2px solid #007bff; padding: 20px; border-radius: 5px; margin-top: 20px;">
//                 <p><strong>Company Name:</strong> ${companyName}</p>
//                 <p><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>
//                 <p><strong>Employee ID:</strong> ${leaveRequest.employeeId}</p>
//                 <p><strong>Employee Name:</strong> ${leaveRequest.name}</p>
//                 <p><strong>Designation:</strong> ${leaveRequest.designation}</p>
//                 <p><strong>Period:</strong> 
//                   <span><strong>From:</strong> ${formattedFromDate}</span>
//                   <span style="margin-left: 20px;"><strong>To:</strong> ${formattedToDate}</span>
//                 </p>
//                 <p><strong>Number of Days:</strong> ${leaveRequest.numOfDays}</p>
//                 <p><strong>Reason for Leave:</strong> ${leaveRequest.reason}</p>
//                 ${leaveBalanceHtml}
//                 <div style="margin-top: 20px;">
//                   ${leaveRequest.attachments && leaveRequest.attachments.length > 0
//                     ? `<p><strong>Attachments:</strong> ${leaveRequest.attachments.map(file => {
//                         const fileName = file.split('/').pop(); // Get only the file name
//                         return `<a href="${file}" target="_blank">${fileName}</a>`;
//                       }).join(', ')}</p>`
//                     : `<p><strong>Attachments:</strong> None</p>`
//                   }
//                 </div>
//               </div>
//               <div style="margin-top: 20px; padding: 10px; background-color: #f1f1f1; border-radius: 5px; text-align: center;">
//                 <p style="margin: 0; font-size: 14px; color: #888;">Please review the leave request.</p>
//               </div>
//             </div>
//           </body>
//         </html>
//       `,
//       attachments: leaveRequest.attachments
//         ? leaveRequest.attachments.map(file => ({
//             filename: file.split('/').pop(), // Attach only file name
//             path: file
//           }))
//         : [],
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Leave request notification sent!');

//   } catch (error) {
//     console.error('Error fetching company name or sending email:', error);
//   }
// };
const sendLeaveRequestNotification = async (leaveRequest, leaveBalance) => {
  const adminEmail = 'groupproject366@gmail.com';

  try {
    // Fetch company name using employee ID
    const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });

    if (!employee) {
      console.error(`Employee not found for ID: ${leaveRequest.employeeId}`);
      return;
    }

    const companyName = employee.CompanyName; // Get Company Name
    const formattedFromDate = formatDate(leaveRequest.fromDate);
    const formattedToDate = formatDate(leaveRequest.toDate);

    // Dynamically get available leave balance based on leave type
    let leaveBalanceHtml = '';
    if (leaveBalance[leaveRequest.leaveType]) {
      if (typeof leaveBalance[leaveRequest.leaveType] === 'object') {
        leaveBalanceHtml = `
          <p><strong>${leaveRequest.leaveType} Details:</strong></p>
          <ul>
            ${Object.entries(leaveBalance[leaveRequest.leaveType])
              .map(([key, value]) => `<li><strong>${key.replace(/([A-Z])/g, ' $1')}:</strong> ${value}</li>`)
              .join('')}
          </ul>
        `;
      } else {
        leaveBalanceHtml = `<p><strong>Available ${leaveRequest.leaveType}:</strong> ${leaveBalance[leaveRequest.leaveType]}</p>`;
      }
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
                <p><strong>Company Name:</strong> ${companyName}</p>
                
                <!-- Two-column layout -->
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 50%; vertical-align: top; padding: 5px;">
                      <p><strong>Employee ID:</strong> ${leaveRequest.employeeId}</p>
                      <p><strong>Employee Name:</strong> ${leaveRequest.name}</p>
                      <p><strong>Designation:</strong> ${leaveRequest.designation}</p>
                      <p><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>
                    </td>
                    <td style="width: 50%; vertical-align: top; padding: 5px;">
                      <p><strong>From:</strong> ${formattedFromDate}</p>
                      <p><strong>To:</strong> ${formattedToDate}</p>
                      <p><strong>Number of Days:</strong> ${leaveRequest.numOfDays}</p>
                      <p><strong>Reason:</strong> ${leaveRequest.reason}</p>
                    </td>
                  </tr>
                </table>

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

    await transporter.sendMail(mailOptions);
    console.log('Leave request notification sent!');

  } catch (error) {
    console.error('Error fetching company name or sending email:', error);
  }
};


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
//   const doc = new PDFDocument({ size: [600, 295], margin: 30 }); // Slightly increased height
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   // Border Box for Slip
//   doc.rect(30, 30, 540, 235).stroke('#007bff'); // Adjusted height

//   // Title - PIONEER GROUP (Bold, Italic, Centered)
//   doc.font('Helvetica-BoldOblique') // Bold & Italic
//     .fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', 30, 35, { width: 540, align: 'center' });

//   // Leave Application Form Title with Space Below
//   doc.font('Helvetica-Bold') // Regular Bold
//     .fontSize(16).fillColor('#2e6da4')
//     .text('Leave Application Form', 30, 55, { width: 540, align: 'center' });

//   doc.moveDown(0.5); // Adds space below Leave Application Form

//   // Leave Type
//   doc.fontSize(12).fillColor('black').text(`Leave Type: ${leaveRequest.leaveType}`, 40, 75);

//   // Employee Details
//   doc.fontSize(10)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, 40, 95)
//     .text(`Employee Name: ${leaveRequest.name}`, 280, 95)
//     .text(`Department: ${department}`, 40, 115)
//     .text(`Designation: ${leaveRequest.designation}`, 280, 115);

//   // Leave Duration
//   doc.text(`From: ${formattedFromDate}`, 40, 135)
//     .text(`To: ${formattedToDate}`, 280, 135);

//   // Number of Days & Balance
//   doc.text(`Number of Days: ${leaveRequest.numOfDays}`, 40, 155);
//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, 280, 155);
//   }

//   // Reason for Leave
//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', 40, 175);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, 40, 190, { width: 500 });

//   // Approval Remarks with Extra Space Below Heading
//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', 40, 210);
//   doc.moveDown(0.5); // Adds a little extra space below "Approval Remarks"

//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, 40, 225)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, 280, 225)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, 40, 245)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, 280, 245);

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
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 295], margin: 30 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   // Border Box for Slip
//   doc.rect(30, 30, 540, 235).stroke('#007bff');

//   // Title - PIONEER GROUP
//   doc.font('Helvetica-Bold')
//     .fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', 30, 35, { width: 540, align: 'center' });

//   // Leave Application Form Title
//   doc.font('Times-Roman')
//     .fontSize(16).fillColor('#2e6da4')
//     .text('Leave Application Form', 30, 55, { width: 540, align: 'center' });

//   doc.moveDown(1.5);

//   // Employee & Leave Details
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, 40, 75)
//     .fontSize(10)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, 40, 95)
//     .text(`Employee Name: ${leaveRequest.name}`, 280, 95)
//     .text(`Department: ${department}`, 40, 115)
//     .text(`Designation: ${leaveRequest.designation}`, 280, 115)
//     .text(`From: ${formattedFromDate}`, 40, 135)
//     .text(`To: ${formattedToDate}`, 280, 135)
//     .text(`Number of Days: ${leaveRequest.numOfDays}`, 40, 155);
  
//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, 280, 155);
//   }

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', 40, 175);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, 40, 190, { width: 500 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', 40, 210);
//   doc.moveDown(1.5);

//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, 40, 225)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, 280, 225)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, 40, 245)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, 280, 245);
//     doc.moveDown(0.6);

//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'], // Sending to both employee and accounts department
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
//         ...(leaveRequest.attachments
//           ? leaveRequest.attachments.map(file => ({ filename: file.split('/').pop(), path: file }))
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
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 295], margin: 30 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   // 📌 Add Image (Top Left Corner)
//   const logoPath = path.join(__dirname, '../public/images/logo.png');
//   if (fs.existsSync(logoPath)) {
//     console.log('Logo found. Adding to PDF.');
//     doc.image(logoPath, 40, 35, { width: 60 }); // Adjust position & width if needed
//   } else {
//     console.error('Logo image not found at:', logoPath);
//   }

//   // Border Box for Slip
//   doc.rect(30, 30, 540, 235).stroke('#007bff');

//   // Title - PIONEER GROUP (Shifted Right)
//   doc.font('Helvetica-Bold')
//     .fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', 120, 35, { width: 450, align: 'center' });

//   // Leave Application Form Title
//   doc.font('Times-Roman')
//     .fontSize(16).fillColor('#2e6da4')
//     .text('Leave Application Form', 120, 55, { width: 450, align: 'center' });

//   doc.moveDown(1.5);

//   // Employee & Leave Details
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, 40, 75)
//     .fontSize(10)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, 40, 95)
//     .text(`Employee Name: ${leaveRequest.name}`, 280, 95)
//     .text(`Department: ${department}`, 40, 115)
//     .text(`Designation: ${leaveRequest.designation}`, 280, 115)
//     .text(`From: ${formattedFromDate}`, 40, 135)
//     .text(`To: ${formattedToDate}`, 280, 135)
//     .text(`Number of Days: ${leaveRequest.numOfDays}`, 40, 155);

//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, 280, 155);
//   }

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', 40, 175);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, 40, 190, { width: 500 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', 40, 210);
//   doc.moveDown(1.5);

//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, 40, 225)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, 280, 225)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, 40, 245)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, 280, 245);

//   doc.moveDown(0.6);
//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
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
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 350], margin: 30 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   // Border Box (Centered)
//   const centerX = 300; // Half of 600
//   const formWidth = 450;
//   const startX = centerX - formWidth / 2;
//   const startY = 50;

//   doc.rect(startX, startY, formWidth, 250).stroke('#007bff');

//   // 📌 Add Image (Top Left Inside Slip)
//   const logoPath = path.join(__dirname, '../public/images/logo.png');
//   if (fs.existsSync(logoPath)) {
//     console.log('Logo found. Adding to PDF.');
//     doc.image(logoPath, startX + 10, startY + 10, { width: 50 }); // Adjust position inside the slip
//   } else {
//     console.error('Logo image not found at:', logoPath);
//   }

//   // Title - PIONEER GROUP (Centered)
//   doc.font('Helvetica-Bold')
//     .fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', startX, startY + 10, { width: formWidth, align: 'center' });

//   // Leave Application Form Title
//   doc.font('Times-Roman')
//     .fontSize(14).fillColor('#2e6da4')
//     .text('Leave Application Form', startX, startY + 30, { width: formWidth, align: 'center' });

//   // Employee & Leave Details (Centered)
//   const detailStartY = startY + 60;
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, startX + 20, detailStartY)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, startX + 20, detailStartY + 20)
//     .text(`Employee Name: ${leaveRequest.name}`, startX + 230, detailStartY + 20)
//     .text(`Department: ${department}`, startX + 20, detailStartY + 40)
//     .text(`Designation: ${leaveRequest.designation}`, startX + 230, detailStartY + 40)
//     .text(`From: ${formattedFromDate}`, startX + 20, detailStartY + 60)
//     .text(`To: ${formattedToDate}`, startX + 230, detailStartY + 60)
//     .text(`Number of Days: ${leaveRequest.numOfDays}`, startX + 20, detailStartY + 80);

//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, startX + 230, detailStartY + 80);
//   }

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', startX + 20, detailStartY + 100);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, startX + 20, detailStartY + 115, { width: formWidth - 40 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', startX + 20, detailStartY + 140);
//   doc.moveDown(1.5);

//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, startX + 20, detailStartY + 160)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, startX + 230, detailStartY + 160)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, startX + 20, detailStartY + 180)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, startX + 230, detailStartY + 180);

//   doc.moveDown(0.6);
//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
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
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 350], margin: 30 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   // Border Box (Centered)
//   const centerX = 300; // Half of 600
//   const formWidth = 450;
//   const startX = centerX - formWidth / 2;
//   const startY = 50;

//   doc.rect(startX, startY, formWidth, 250).stroke('#007bff');

//   // 📌 Add Image (Top Left Inside Slip)
//   const logoPath = path.join(__dirname, '../public/images/logo.png');
//   if (fs.existsSync(logoPath)) {
//     console.log('Logo found. Adding to PDF.');
//     doc.image(logoPath, startX + 10, startY + 10, { width: 50 }); // Adjust position inside the slip
//   } else {
//     console.error('Logo image not found at:', logoPath);
//   }

//   // Title - PIONEER GROUP (Centered)
//   doc.font('Helvetica-Bold')
//     .fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', startX, startY + 10, { width: formWidth, align: 'center' });

//   // Address Lines (Centered)
//   doc.font('Helvetica')
//     .fontSize(10).fillColor('black')
//     .text('"Pioneer Tower", Premises No. 20-085', startX, startY + 30, { width: formWidth, align: 'center' })
//     .text('Street No. 85, AB-109, New Town, Kolkata-700 193', startX, startY + 45, { width: formWidth, align: 'center' })
//     .fillColor('blue').text('Ph: 9007938111, Email: pioneer.surveyors@gmail.com', startX, startY + 60, { width: formWidth, align: 'center', link: 'mailto:pioneer.surveyors@gmail.com' })
//     .fillColor('black');

//   // Leave Application Form Title
//   doc.font('Times-Roman')
//     .fontSize(14).fillColor('#2e6da4')
//     .text('Leave Application Form', startX, startY + 80, { width: formWidth, align: 'center' });

//   // Employee & Leave Details (Centered)
//   const detailStartY = startY + 110;
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, startX + 20, detailStartY)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, startX + 20, detailStartY + 20)
//     .text(`Employee Name: ${leaveRequest.name}`, startX + 230, detailStartY + 20)
//     .text(`Department: ${department}`, startX + 20, detailStartY + 40)
//     .text(`Designation: ${leaveRequest.designation}`, startX + 230, detailStartY + 40)
//     .text(`From: ${formattedFromDate}`, startX + 20, detailStartY + 60)
//     .text(`To: ${formattedToDate}`, startX + 230, detailStartY + 60)
//     .text(`Number of Days: ${leaveRequest.numOfDays}`, startX + 20, detailStartY + 80);

//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, startX + 230, detailStartY + 80);
//   }

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', startX + 20, detailStartY + 100);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, startX + 20, detailStartY + 115, { width: formWidth - 40 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', startX + 20, detailStartY + 140);
//   doc.moveDown(1.5);

//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, startX + 20, detailStartY + 160)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, startX + 230, detailStartY + 160)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, startX + 20, detailStartY + 180)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, startX + 230, detailStartY + 180);

//   doc.moveDown(0.6);
//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
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
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 400], margin: 20 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   const startX = 50;
//   const startY = 30;
//   const formWidth = 500;

//   doc.rect(startX, startY, formWidth, 340).stroke('#007bff');

//   const logoPath = path.join(__dirname, '../public/images/logo.png');
//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, startX + 10, startY + 10, { width: 50 });
//   }

//   doc.font('Helvetica-Bold').fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', startX, startY + 10, { width: formWidth, align: 'center' });

//   doc.font('Helvetica').fontSize(10).fillColor('black')
//     .text('"Pioneer Tower", Premises No. 20-085', startX, startY + 30, { width: formWidth, align: 'center' })
//     .text('Street No. 85, AB-109, New Town, Kolkata-700 193', startX, startY + 45, { width: formWidth, align: 'center' })
//     .fillColor('blue').text('Ph: 9007938111, Email: pioneer.surveyors@gmail.com', startX, startY + 60, { width: formWidth, align: 'center', link: 'mailto:pioneer.surveyors@gmail.com' })
//     .fillColor('black');

//   doc.font('Times-Roman').fontSize(14).fillColor('#2e6da4')
//     .text('Leave Application Form', startX, startY + 80, { width: formWidth, align: 'center' });

//   const detailStartY = startY + 110;
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, startX + 20, detailStartY)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, startX + 20, detailStartY + 20)
//     .text(`Employee Name: ${leaveRequest.name}`, startX + 250, detailStartY + 20)
//     .text(`Department: ${department}`, startX + 20, detailStartY + 40)
//     .text(`Designation: ${leaveRequest.designation}`, startX + 250, detailStartY + 40)
//     .text(`From: ${formattedFromDate}`, startX + 20, detailStartY + 60)
//     .text(`To: ${formattedToDate}`, startX + 250, detailStartY + 60)
//     .text(`Number of Days: ${leaveRequest.numOfDays}`, startX + 20, detailStartY + 80);

//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, startX + 250, detailStartY + 80);
//   }

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', startX + 20, detailStartY + 100);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, startX + 20, detailStartY + 115, { width: formWidth - 40 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', startX + 20, detailStartY + 140);
//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, startX + 20, detailStartY + 160)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, startX + 250, detailStartY + 160)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, startX + 20, detailStartY + 180)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, startX + 250, detailStartY + 180);

//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Leave decision notification sent with PDF attachment!');
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
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 400], margin: 20 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   const startX = 50;
//   const startY = 30;
//   const formWidth = 500;

//   doc.rect(startX, startY, formWidth, 340).stroke('#007bff');

//   const logoPath = path.join(__dirname, '../public/images/logo.png');
//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, startX + 10, startY + 10, { width: 50 });
//   }

//   doc.font('Helvetica-Bold').fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', startX, startY + 10, { width: formWidth, align: 'center' });

//   doc.font('Helvetica').fontSize(10).fillColor('black')
//     .text('"Pioneer Tower", Premises No. 20-085', startX, startY + 30, { width: formWidth, align: 'center' })
//     .text('Street No. 85, AB-109, New Town, Kolkata-700 193', startX, startY + 45, { width: formWidth, align: 'center' })
//     .fillColor('blue').text('Ph: 9007938111, Email: pioneer.surveyors@gmail.com', startX, startY + 60, { width: formWidth, align: 'center', link: 'mailto:pioneer.surveyors@gmail.com' })
//     .fillColor('black');

//   doc.font('Times-Roman').fontSize(14).fillColor('#2e6da4')
//     .text('Leave Application Form', startX, startY + 80, { width: formWidth, align: 'center' });

//   const detailStartY = startY + 110;

//   // Centered Leave Type
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, startX, detailStartY, { width: formWidth, align: 'center' });

//   doc.text(`Employee ID: ${leaveRequest.employeeId}`, startX + 20, detailStartY + 20)
//     .text(`Employee Name: ${leaveRequest.name}`, startX + 250, detailStartY + 20)
//     .text(`Department: ${department}`, startX + 20, detailStartY + 40)
//     .text(`Designation: ${leaveRequest.designation}`, startX + 250, detailStartY + 40)
//     .text(`From: ${formattedFromDate}`, startX + 20, detailStartY + 60)
//     .text(`To: ${formattedToDate}`, startX + 250, detailStartY + 60)
//     .text(`Number of Days: ${leaveRequest.numOfDays}`, startX + 20, detailStartY + 80);

//   if (leaveRequest.leaveType === 'CL' || leaveRequest.leaveType === 'ML') {
//     doc.text(`Remaining Balance: ${remainingBalance}`, startX + 250, detailStartY + 80);
//   }

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', startX + 20, detailStartY + 100);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, startX + 20, detailStartY + 115, { width: formWidth - 40 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', startX + 20, detailStartY + 140);
//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, startX + 20, detailStartY + 160)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, startX + 250, detailStartY + 160)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, startX + 20, detailStartY + 180)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, startX + 250, detailStartY + 180);

//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Leave decision notification sent with PDF attachment!');
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
//   const formattedApplicationDate = formatDate(leaveRequest.createdAt);

//   const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });
//   if (!employee) {
//     console.error('Employee not found!');
//     return;
//   }

//   const employeeEmail = employee.EmployeeEmailID;
//   const department = employee.Department;

//   let remainingBalance = 'N/A';
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 400], margin: 20 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   const startX = 50;
//   const startY = 30;
//   const formWidth = 500;

//   doc.rect(startX, startY, formWidth, 340).stroke('#007bff');

//   const logoPath = path.join(__dirname, '../public/images/logo.png');
//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, startX + 10, startY + 10, { width: 50 });
//   }

//   doc.font('Helvetica-Bold').fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', startX, startY + 10, { width: formWidth, align: 'center' });

//   doc.font('Helvetica').fontSize(10).fillColor('black')
//     .text('"Pioneer Tower", Premises No. 20-085', startX, startY + 30, { width: formWidth, align: 'center' })
//     .text('Street No. 85, AB-109, New Town, Kolkata-700 193', startX, startY + 45, { width: formWidth, align: 'center' })
//     .fillColor('blue').text('Ph: 9007938111, Email: pioneer.surveyors@gmail.com', startX, startY + 60, { width: formWidth, align: 'center', link: 'mailto:pioneer.surveyors@gmail.com' })
//     .fillColor('black');

//   doc.font('Times-Roman').fontSize(14).fillColor('#2e6da4')
//     .text('Leave Application Form', startX, startY + 80, { width: formWidth, align: 'center' });

//   const detailStartY = startY + 110;

//   // Centered Leave Type
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, startX, detailStartY, { width: formWidth, align: 'center' });

//   // Left Side Fields
//   doc.text(`Employee Name: ${leaveRequest.name}`, startX + 20, detailStartY + 20)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, startX + 20, detailStartY + 40)
//     .text(`Designation: ${leaveRequest.designation}`, startX + 20, detailStartY + 60)
//     .text(`Department: ${department}`, startX + 20, detailStartY + 80);

//   // Right Side Fields
//   doc.text(`Leave Period: From ${formattedFromDate} To ${formattedToDate}`, startX + 250, detailStartY + 20)
//     .text(`Number of Days: ${leaveRequest.numOfDays}`, startX + 250, detailStartY + 40)
//     .text(`Remaining Balance: ${remainingBalance}`, startX + 250, detailStartY + 60)
//     .text(`Application Date: ${formattedApplicationDate}`, startX + 250, detailStartY + 80);

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', startX + 20, detailStartY + 100);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, startX + 20, detailStartY + 115, { width: formWidth - 40 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', startX + 20, detailStartY + 140);
//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, startX + 20, detailStartY + 160)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, startX + 250, detailStartY + 160)
//     .text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, startX + 20, detailStartY + 180)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, startX + 250, detailStartY + 180);

//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Leave decision notification sent with PDF attachment!');
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
//   const formattedApplicationDate = formatDate(leaveRequest.createdAt);

//   const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });
//   if (!employee) {
//     console.error('Employee not found!');
//     return;
//   }

//   const employeeEmail = employee.EmployeeEmailID;
//   const department = employee.Department;

//   let remainingBalance = 'N/A';
//   switch (leaveRequest.leaveType) {
//     case 'CL':
//       remainingBalance = employee.CL;
//       break;
//     case 'ML':
//       remainingBalance = employee.ML;
//       break;
//     case 'SL':
//       remainingBalance = '';
//       break;
//   }

//   // Generate PDF
//   const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
//   const doc = new PDFDocument({ size: [600, 400], margin: 20 });
//   const writeStream = fs.createWriteStream(pdfPath);
//   doc.pipe(writeStream);

//   const startX = 30;
//   const startY = 30;
//   const formWidth = 540;

//   doc.rect(startX, startY, formWidth, 340).stroke('#007bff');

//   const logoPath = path.join(__dirname, '../public/images/logo.png');
//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, startX + 10, startY + 10, { width: 50 });
//   }

//   doc.font('Helvetica-Bold').fontSize(16).fillColor('#2e6da4')
//     .text('PIONEER GROUP', startX, startY + 10, { width: formWidth, align: 'center' });

//   doc.font('Helvetica').fontSize(10).fillColor('black')
//     .text('"Pioneer Tower", Premises No. 20-085', startX, startY + 30, { width: formWidth, align: 'center' })
//     .text('Street No. 85, AB-109, New Town, Kolkata-700 193', startX, startY + 45, { width: formWidth, align: 'center' })
//     .fillColor('blue').text('Ph: 9007938111, Email: pioneer.surveyors@gmail.com', startX, startY + 60, { width: formWidth, align: 'center', link: 'mailto:pioneer.surveyors@gmail.com' })
//     .fillColor('black');

//   doc.font('Times-Roman').fontSize(14).fillColor('#2e6da4')
//     .text('Leave Application Form', startX, startY + 75, { width: formWidth, align: 'center' }); // Reduced space above Leave Type

//   const detailStartY = startY + 100;

//   // Centered Leave Type with extra space below
//   doc.fontSize(12).fillColor('black')
//     .text(`Leave Type: ${leaveRequest.leaveType}`, startX, detailStartY, { width: formWidth, align: 'center' });
  
//   const fieldsStartY = detailStartY + 20; // Added extra space below Leave Type

//   // Left Side Fields
//   doc.text(`Employee Name: ${leaveRequest.name}`, startX + 20, fieldsStartY)
//     .text(`Employee ID: ${leaveRequest.employeeId}`, startX + 20, fieldsStartY + 20)
//     .text(`Designation: ${leaveRequest.designation}`, startX + 20, fieldsStartY + 40)
//     .text(`Department: ${department}`, startX + 20, fieldsStartY + 60);

//   // Right Side Fields with space before "To"
//   doc.text(`Leave Period: From : ${formattedFromDate}  To : ${formattedToDate}`, startX + 250, fieldsStartY);
//   doc.text(`Number of Days: ${leaveRequest.numOfDays}`, startX + 250, fieldsStartY + 20);
//   doc.text(`Remaining Balance: ${remainingBalance}`, startX + 250, fieldsStartY + 40);
//   doc.text(`Application Date: ${formattedApplicationDate}`, startX + 250, fieldsStartY + 60);

//   doc.fontSize(12).fillColor('#2e6da4').text('Reason:', startX + 20, fieldsStartY + 80);
//   doc.fontSize(10).fillColor('black').text(leaveRequest.reason, startX + 20, fieldsStartY + 95, { width: formWidth - 40 });

//   doc.fontSize(12).fillColor('#2e6da4').text('Approval Remarks:', startX + 20, fieldsStartY + 120);
//   doc.fontSize(10).fillColor('black')
//     .text(`Reporting Head Signature: ${leaveRequest.reportingHeadSignature || 'N/A'}`, startX + 20, fieldsStartY + 140)
//     .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, startX + 250, fieldsStartY + 140);

//   // Added more space below Reporting Head Signature & Comment
//   const sanctionStartY = fieldsStartY + 160;

//   doc.text(`Sanctioning Authority Signature: ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, startX + 20, sanctionStartY)
//     .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, startX + 250, sanctionStartY);

//   doc.end();

//   writeStream.on('finish', async () => {
//     const mailOptions = {
//       from: 'suprita213@gmail.com',
//       to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
//       subject: `Leave Request ${leaveRequest.approvalStatus}`,
//       text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
//       attachments: [
//         {
//           filename: `leave_request_${leaveRequest.employeeId}.pdf`,
//           path: pdfPath,
//         },
//       ],
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Leave decision notification sent with PDF attachment!');
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
  const formattedApplicationDate = formatDate(leaveRequest.createdAt);

  const employee = await Employee.findOne({ EmpID: leaveRequest.employeeId });
  if (!employee) {
    console.error('Employee not found!');
    return;
  }

  const employeeEmail = employee.EmployeeEmailID;
  const department = employee.Department;
  const companyName = employee.CompanyName.toUpperCase();

  let remainingBalance = 'N/A';
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

  // Generate PDF
  const pdfPath = path.join(__dirname, `leave_request_${leaveRequest.employeeId}.pdf`);
  const doc = new PDFDocument({ size: [600, 400], margin: 20 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  const startX = 30;
  const startY = 30;
  const formWidth = 540;

  doc.rect(startX, startY, formWidth, 340).stroke('#007bff');

  const logoPath = path.join(__dirname, '../public/images/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, startX + 10, startY + 10, { width: 50 });
  }

  doc.font('Helvetica-Bold').fontSize(16).fillColor('#2e6da4')
    .text(companyName, startX, startY + 10, { width: formWidth, align: 'center' });

    doc.font('Helvetica').fontSize(10).fillColor('black')
    .text('"Pioneer Tower", Premises No. 20-085', startX, startY + 30, { width: formWidth, align: 'center' })
    .text('Street No. 85, AB-109, New Town, Kolkata-700 193', startX, startY + 45, { width: formWidth, align: 'center' })
    .text('Ph: 9007938111, Email: pioneer.surveyors@gmail.com', startX, startY + 60, { width: formWidth, align: 'center' }) // Removed 'link' and forced color to black
    .fillColor('black');
  

  doc.font('Times-Roman').fontSize(14).fillColor('#2e6da4')
    .text('Leave Application Form', startX, startY + 75, { width: formWidth, align: 'center' });

  const detailStartY = startY + 100; // Moved Leave Type slightly higher

  // Centered Leave Type with adjusted position
  doc.fontSize(12).fillColor('black')
    .text(`Leave Type: ${leaveRequest.leaveType}`, startX, detailStartY, { width: formWidth, align: 'center' });

  const fieldsStartY = detailStartY + 35; // Increased space below Leave Type

  // Left Side Fields
  doc.text(`Employee Name: ${leaveRequest.name}`, startX + 20, fieldsStartY)
    .text(`Employee ID     : ${leaveRequest.employeeId}`, startX + 20, fieldsStartY + 20)
    .text(`Designation       : ${leaveRequest.designation}`, startX + 20, fieldsStartY + 40)
    .text(`Department        : ${department}`, startX + 20, fieldsStartY + 60);

  // Right Side Fields with space before "To"
  doc.text(`Leave Period          : From : ${formattedFromDate}  To : ${formattedToDate}`, startX + 250, fieldsStartY);
  doc.text(`Number of Days     : ${leaveRequest.numOfDays}`, startX + 250, fieldsStartY + 20);
  doc.text(`Remaining Balance: ${remainingBalance}`, startX + 250, fieldsStartY + 40);
  doc.text(`Application Date    : ${formattedApplicationDate}`, startX + 250, fieldsStartY + 60);

  doc.fontSize(12).fillColor('#2e6da4').text('Leave Reason:', startX + 20, fieldsStartY + 80);
  doc.fontSize(10).fillColor('black').text(leaveRequest.reason, startX + 20, fieldsStartY + 95, { width: formWidth - 40, lineGap: -2, height: 40 });

  doc.fontSize(12).fillColor('#2e6da4').text('Approval with Remarks:', startX + 20, fieldsStartY + 120);

  doc.fontSize(10).fillColor('black')
  .text(`Forwarded by : ${leaveRequest.reportingHeadSignature || 'N/A'}`, startX + 20, fieldsStartY + 140)
  .text(`Comment: ${leaveRequest.reportingHeadReason || 'N/A'}`, startX + 250, fieldsStartY + 140);

const sanctionStartY = fieldsStartY + 165; // Move sanctioning section higher

  doc.text(`Approved by  : ${leaveRequest.sanctioningAuthoritySignature || 'N/A'}`, startX + 20, sanctionStartY)
    .text(`Comment: ${leaveRequest.sanctioningAuthorityReason || 'N/A'}`, startX + 250, sanctionStartY);

  doc.end();

  writeStream.on('finish', async () => {
    const mailOptions = {
      from: 'suprita213@gmail.com',
      to: [employeeEmail, 'it.pioneergeoscience@gmail.com'],
      subject: `Leave Request ${leaveRequest.approvalStatus}`,
      text: `Your leave request has been ${leaveRequest.approvalStatus}. See attached PDF.`,
      attachments: [
        {
          filename: `leave_request_${leaveRequest.employeeId}.pdf`,
          path: pdfPath,
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Leave decision notification sent with PDF attachment!');
      fs.unlink(pdfPath, (err) => {
        if (err) console.error('Error deleting PDF:', err);
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
};


module.exports = { sendLeaveRequestNotification, sendLeaveDecisionNotification };
