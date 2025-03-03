const EmpMaster = require("../models/EmpMaster"); // Import EmployeeMaster model
const Salary = require("../models/salaryModel"); // Import Salary model
const Absent = require("../models/AbsentList");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const numWords = require("number-to-words");
const puppeteer = require("puppeteer");
const axios = require("axios");
const express = require("express");
const app = express();
const CustomizeLeave = require("../models/customizeLeave");

// const {getAbsentByEmpIDAndMonth} = require("./leaveController");

// const { getAbsentListByEmpIDAndMonth} = require("./absentListController");

/**
 * @desc Add new salary record
 * @route POST /api/salary/:id/salary
 */
const addSalary = async (req, res) => {
  const { id } = req.params; // Extract EmpID from the URL
  const { month, income, deductions, netIncome } = req.body; // Extract salary details from the request body

  try {
    // Log the entire payload to debug
    console.log("Received Payload:", req.body);

    // Check if employee exists in EmployeeMaster collection
    const employee = await EmpMaster.findOne({ EmpID: id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Validate if all necessary fields are present
    if (!month || !income || !deductions || netIncome === undefined) {
      return res.status(400).json({ message: "Invalid salary data" });
    }

    // Check if salary record for this month already exists for the employee
    const existingSalary = await Salary.findOne({ EmpID: id, month });

    if (existingSalary) {
      return res
        .status(400)
        .json({ message: "Salary details already exist for this month" });
    }

    // Create a new salary record
    const newSalary = new Salary({
      EmpID: id,
      month,
      income,
      deductions,
      netIncome,
    });

    // Save the new salary record to the database
    await newSalary.save();

    // Respond with the success message and the saved salary data
    res.status(201).json({
      message: "Salary record created successfully",
      salary: newSalary,
    });
  } catch (error) {
    console.error("Error adding salary:", error);
    res.status(500).json({ message: error.message });
  }
};

const addOrUpdateSalary = async (req, res) => {
  const { id } = req.params;

  // Ensure salary data exists in the request body
  const salary = req.body.salary;

  if (!salary) {
    return res
      .status(400)
      .json({ message: "Salary data is missing in the request body" });
  }

  const { income, deductions, netIncome, month } = salary;

  console.log("Received salary data:", salary); // Log the incoming data

  try {
    // Check if employee exists
    const employee = await EmpMaster.findOne({ EmpID: id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("Employee found:", employee);

    // Validate the incoming salary data
    if (!income || !deductions || typeof netIncome !== "number" || !month) {
      return res.status(400).json({ message: "Invalid salary data" });
    }

    // Try to find the existing salary record for the given employee and month
    let salaryRecord = await Salary.findOne({ EmpID: id, month });

    if (salaryRecord) {
      // Update the existing salary record
      salaryRecord.income = income;
      salaryRecord.deductions = deductions;
      salaryRecord.netIncome = netIncome;

      await salaryRecord.save();
      return res.status(200).json({
        message: "Salary details updated successfully",
        salaryRecord,
      });
    } else {
      // Create a new salary record
      salaryRecord = new Salary({
        EmpID: id,
        month,
        income,
        deductions,
        netIncome,
      });

      await salaryRecord.save();
      return res.status(201).json({
        message: "Salary record created successfully",
        salaryRecord,
      });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in salary update:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Fetch salary details for an employee by EmpID
const getSalaryByEmpId = async (req, res) => {
  const { id, month } = req.params; // Extract EmpID and month from the URL params

  try {
    console.log(`Fetching salary for EmpID: ${id} for the month: ${month}`);

    // Fetch salary data based on EmpID and month
    const salary = await Salary.findOne({ EmpID: id, month: month });

    if (!salary) {
      console.log(
        `No salary record found for EmpID: ${id} for the month: ${month}`
      );
      return res.status(404).json({
        message:
          "Salary record not found for the employee in the specified month",
      });
    }

    console.log("Salary record found:", salary);

    // Return salary data
    res.status(200).json({ salary });
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete salary record by EmpID and Month
 * @route DELETE /api/salary/:id/salary/:month
 */
const deleteSalary = async (req, res) => {
  const { id, month } = req.params; // Extract EmpID and month from the URL

  try {
    // Find and delete the salary record
    const deletedSalary = await Salary.findOneAndDelete({ EmpID: id, month });

    if (!deletedSalary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json({ message: "Salary record deleted successfully" });
  } catch (error) {
    console.error("Error deleting salary:", error);
    res.status(500).json({ message: error.message });
  }
};

function numberToWords(num) {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num === 0) return "zero rupees only";

  function convertToWords(n) {
    let str = "";

    if (n >= 1000) {
      str += convertToWords(Math.floor(n / 1000)) + " thousand ";
      n %= 1000;
    }

    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " hundred ";
      n %= 100;
    }

    if (n > 0) {
      if (n < 20) {
        str += ones[n] + " ";
      } else {
        str += tens[Math.floor(n / 10)] + " ";
        if (n % 10 > 0) {
          str += ones[n % 10] + " ";
        }
      }
    }

    return str.trim();
  }

  return `rupees. ${convertToWords(num)} rupees only`;
}

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getDaysInMonth = (month, year) => {
  return (new Date(year, month, 0).getDate());
};

const calculatePT = (totalIncome) =>
  totalIncome <= 10000
    ? 0
    : totalIncome > 10000 && totalIncome <= 15000
    ? 110
    : totalIncome > 15000 && totalIncome <= 25000
    ? 130
    : totalIncome > 25000 && totalIncome <= 40000
    ? 150
    : 200;

    function getCurrentMonthName() {
      return new Date().toLocaleString("default", { month: "long" });
    }

    function getCurrentYear() {
      return new Date().getFullYear();
    }
    const getAbsentListByEmpIDAndMonth = async (empId, month) => {
      try {
          console.log(`🔍 Searching for EmpID: "${empId}", Month: "${month}"`);
          
          // Ensure month includes year (e.g., "February 2026")
          const absent = await Absent.findOne({ 
              EmpID: empId.trim(), 
              Month: new RegExp(`^${month}\\s\\d{4}$`, "i") // Match "February 2026" dynamically
          });
    
          if (!absent) {
              console.log(`❌ No absent record found for EmpID: "${empId}" and Month: "${month}"`);
              return { data: { DaysAbsent: 0 } };
          }
    
          console.log(`✅ Absent record found: ${JSON.stringify(absent)}`);
          return { data: { DaysAbsent: absent.DaysAbsent } };
    
      } catch (error) {
          console.error("❌ Error getting absent list:", error);
          throw error;
      }
    };
    
    

const calculateAbsentDays = async (empId, month) => {
  try {
    const AbsentDays = await getAbsentListByEmpIDAndMonth(empId, month);
    console.log("absent days" ,AbsentDays.data.DaysAbsent);
    const TotalAbsentDays = AbsentDays.data.DaysAbsent || 0;
    console.log(TotalAbsentDays)

    const Rejecteddays = await getLeaveByEmpIDAndMonth(empId , month);
    console.log("rejected data" ,Rejecteddays);
    const totalLeavesApplied = Rejecteddays || 0;

    // Calculate final absent days
    // Final = Absent days + Rejected leaves - Total leaves applied
    const finalAbsentDays = Math.max(0,TotalAbsentDays - totalLeavesApplied);
    console.log("final absent days" ,finalAbsentDays)

    return Math.max(0, finalAbsentDays); // Ensure we don't return negative days
  } catch (error) {
    console.error("Error calculating absent days:", error);
    throw error;
  }
};
const getLeaveByEmpIDAndMonth = async (empId, month) => {
  try {
    // Define month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Log the input month
    console.log(`Input Month: "${month}"`);

    if (!monthNames.includes(month)) {
      throw new Error(`Invalid month name provided: "${month}"`);
    }

    // Fetch rejected leave requests for the employee
    const leaves = await CustomizeLeave.find({
      employeeId: empId,
      approvalStatus: "Rejected"
    }).select("numOfDays createdAt");

    console.log("Fetched rejected leaves:", leaves);

    // Filter by month only (ignoring year)
    const filteredLeaves = leaves.filter(leave => {
      const leaveMonth = `"${monthNames[new Date(leave.createdAt).getMonth()]}"`; // Convert to string with double quotes
      console.log(`Leave Month from DB: ${leaveMonth}`);

      return leaveMonth === `"${month}"`;
    });

    // Extract numOfDays values
    const rejectedDaysArray = filteredLeaves.map(leave => leave.numOfDays);

    console.log("Filtered rejected days:", rejectedDaysArray);

    return rejectedDaysArray; // Returns an array of rejected numOfDays values

  } catch (error) {
    console.error("Error fetching rejected leaves:", error);
    throw error;
  }
};





// function getDaysInMonth(month, year) {
//   // Months in JavaScript are 0-indexed (0 = January, 11 = December)
//   // Passing 0 as the day returns the last day of the previous month
//   return new Date(year, month, 0).getDate();
// }


/**
 * @desc Generate salary slip PDF for an employee
 * @route GET /api/salary/salary-slip/:id/:month
 */
const generateSalary = async (req, res) => {
  try {
    const { startId, endId } = req.body;

    // Fetch employees within the given range
    const employees = await EmpMaster.find({
      EmpID: { $gte: startId, $lte: endId },
    });

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found in the given range." });
    }

    const pdfDirectory = path.join(__dirname, "../salary_pdfs");
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory); // Create directory if it doesn't exist
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    let generatedFiles = [];
    const mergedPdfPath = path.join(pdfDirectory, "all_salary_slips.pdf");

    // Remove old merged PDF if it exists
    if (fs.existsSync(mergedPdfPath)) {
      fs.unlinkSync(mergedPdfPath);
    }

    const calculatePT = (basic) => 
      basic <= 10000
        ? 0
        : basic > 10000 && basic <= 15000
        ? 110
        : basic > 15000 && basic <= 25000
        ? 130
        : basic > 25000 && basic <= 40000
        ? 150
        : 200;
    

    for (let employee of employees) {
      // Salary calculations
      const basic = employee.basic || 0;
      const hra = parseInt(basic * 0.2);
      const da = parseInt(basic * 0.4);
      const convence = parseInt(basic * 0.2);
      const medical = parseInt(basic * 0.08333);
      let incentive=0;
      let advance = 0;
      let others = 0;
      let grossSalary = parseInt(
        basic + hra + da + convence + medical + incentive + advance + others
      );
      const cpf = Math.min(parseInt((basic + da) * 0.12), 1800);
      const esi = parseInt((basic + da + hra + convence + medical) * 0.0075);
      let prof_tax = (calculatePT(basic));
      let tds = 0;
      let advance_deduction = 0;
      let others_deduction = 0;
      let totalDeductions = parseInt(
        cpf + esi + prof_tax + tds + advance_deduction + others_deduction
      );
      let netSalary = parseInt(grossSalary - totalDeductions);

      const pdfPath = path.join(
        pdfDirectory,
        `salary_slip_${employee.EmpID}.pdf`
      );

      // Generate HTML for PDF
      const htmlContent = `
                               <html>
<head>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .container { width: 90%; margin: auto; border: 1px solid #000; padding: 15px; }
        .header { text-align: center; margin-bottom: 10px; }
        .company-name { font-size: 32px; font-weight: bold; margin: 5px 0; }
                .subcompany-name{font-size: 20px; font-weight: bold; margin: 5px 0; margin-bottom: 20px;}
        .address { font-size: 12px; margin: 5px 0; line-height: 1.4; }
        .payslip-header { font-size: 16px; font-weight: bold; margin: 10px 0; margin-top:18px; }
         .employee-info {
    font-family: Arial, sans-serif;
    padding: 20px;
    width: 90%;
    margin: 20px auto;
    display: flex;
    flex-wrap: nowrap;
    gap: 200px; /* Space between columns */
}

.info-row {
    flex: 1 1 45%; /* Two columns with some spacing */
    display: grid;
    /* flex-direction: row; */
    align-items: center;
    margin-bottom: 12px;
}

.info-row strong {
    display: inline-block;
    width: 80px; /* Fixed width for labels */
    color: #666;
}

.info-row strong + :not(strong) {
    flex: 1;
    color: #333;
}

/* Ensure only 2 rows on the left and 2 on the right */
.employee-info .info-row:nth-child(1),
.employee-info .info-row:nth-child(2) {
    flex-basis: 100%; /* Left column */
}

.employee-info .info-row:nth-child(3),
.employee-info .info-row:nth-child(4) {
    flex-basis: 100%; /* Right column */
}

.info-row span {
    margin-left: 5px;
}
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        .footer { margin-top: 15px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
        <img src="https://pgssw.co.in/assets/admin-source/images/logo.png" alt="Pioneer Logo" style="width: 100px; height: 100px;">
            <div class="company-name">Pioneer Group</div>
            <br/>
            <div class="subcompany-name">${employee.CompanyName}</div>
            <div class="address">
                Pioneer Tower, Street No. 85, Opposite tank No. 2, 1st Floor,<br>
                Action Area - 1, Plot - AB-109, Newtown,<br>
                West Bengal 700156
            </div>
            <div class="payslip-header">Payslip</div>
        </div>

           <div class="employee-info">
            <div class="info-row">
                <div class="info-col"><strong>Employee ID:</strong> ${
                  employee.EmpID
                }</div>
                <div class="info-col"><strong>Date of Join:</strong> ${formatDate(
                  employee.DateOfJoining
                )}</div>
                <div class="info-col"><strong>Employee Name:</strong> ${
                  employee.EmpName
                }</div>
                <div class="info-col"><strong>Department:</strong> ${
                  employee.Department
                }</div>
            </div>
            <div class="info-row">
                <div class="info-col"><strong>Pay Period:</strong> January 2025</div>
                <div class="info-col"><strong>Designation:</strong> ${
                  employee.Designation
                }</div>
                <div class="info-col"><strong>Days Worked:</strong> ${getDaysInMonth(
                  getCurrentMonthName() , getCurrentYear()
                )} days</div>
                <div class="info-col"><strong>UAN Number:</strong> ${
                  employee.UAN
                }</div>
            </div>
        </div>

        <table>
            <tr>
                <th>Income</th><th>Amount</th><th>Deductions</th><th>Amount</th>
            </tr>
            <tr><td>BASIC</td><td>${
              employee.basic
            }</td><td>CPF</td><td>${cpf}</td></tr>
            <tr><td>DA</td><td>${da}</td><td>ESI</td><td>${esi}</td></tr>
            <tr><td>HRA</td><td>${hra}</td><td>PROF_TAX</td><td>${prof_tax}</td></tr>
            <tr><td>CONVEYENCE</td><td>${convence}</td><td>TDS</td><td>${tds}</td></tr>
            <tr><td>MEDICAL</td><td>${medical}</td><td>ADVANCE</td><td>${advance_deduction}</td></tr>
            <tr><td>INCENTIVE</td><td>${incentive}</td><td>OTHERS</td><td>${others_deduction}</td></tr>
            <tr><td>ADVANCE</td><td>${advance}</td><td></td><td></td></tr>
            <tr><td>OTHERS</td><td>${others}</td><td></td><td></td></tr>
            <tr>
                <td><strong>Gross Salary</strong></td><td>₹${grossSalary}</td>
                <td><strong>Total Deductions</strong></td><td>₹${totalDeductions}</td>
            </tr>
            <tr>
                <td><strong>Net Salary</strong></td>
                <td colspan="3">₹${netSalary} (${numberToWords(netSalary)})</td>
            </tr>
        </table>

        <div class="footer">
            <div><strong>Leave Balance:</strong> PL:${employee.PL || 0} | CL:${
        employee.CL || 0
      } | ML:${employee.ML || 0}</div>
            <div><strong>Balance Amounts:</strong> Loan: ₹${
              Salary.others || 0
            } | Advance: ₹${Salary.advance || 0}</div>
        </div>
    </div>
</body>
</html>`;

      await page.setContent(htmlContent);
      await page.pdf({ path: pdfPath, format: "A4" });

      generatedFiles.push(pdfPath);
    }

    await browser.close();

    // Merge PDFs into a single file
    const mergedPdf = await PDFDocument.create();
    for (let pdfFilePath of generatedFiles) {
      const pdfBytes = fs.readFileSync(pdfFilePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    fs.writeFileSync(mergedPdfPath, await mergedPdf.save());

    // Convert merged PDF to Base64
    const mergedPdfBytes = await mergedPdf.save();
    const base64Pdf = Buffer.from(mergedPdfBytes).toString("base64");

    res.status(200).json({
      message: "Salary slips generated successfully",
      pdfBase64: base64Pdf,
    });
  } catch (error) {
    console.error("Error generating salary slips:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// saves salary month wise
const saveSalaries = async (req, res) => {
  try {
    const { startId, endId, month, year } = req.body;

    if (!startId || !endId || !month || !year) {
      return res
        .status(400)
        .json({ message: "Please provide startId, endId, month, and year." });
    }

    // Check if salary records already exist for this month and employee range
    const existingSalaries = await Salary.find({
      EmpID: { $gte: startId, $lte: endId },
      month: `${month} ${year}`,
    });

    if (existingSalaries.length > 0) {
      // alert("Salary records for the selected month already exist!")
      return res.status(400).json({
        message: "Salary records for the selected month already exist!",
      });
    }

    // Fetch employees within the given range
    const employees = await EmpMaster.find({
      EmpID: { $gte: startId, $lte: endId },
    });

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found in the given range." });
    }

    const getMonthNumberAndDays = (monthName) => {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    
      // Convert month name to the month index (0-based, so January is 0, May is 4, etc.)
      const monthIndex = monthNames.findIndex(name => name.toLowerCase() === monthName.toLowerCase());
    
      if (monthIndex === -1) {
        return `Invalid month name: ${monthName}`; // If the month is invalid
      }
    
      const year = new Date().getFullYear(); // Get the current year
      const monthNumber = monthIndex + 1; // Month number (1-based, so January is 1, May is 5, etc.)
      const daysInMonth = getDaysInMonth(monthNumber, year);
    
      return { monthNumber, daysInMonth };
    };

    const salaryRecords = [];

    for (let employee of employees) {
      // Calculate income components
      const basic = employee.basic || 0;
      const hra = parseInt(basic * 0.2);
      const da = parseInt(basic * 0.4);
      const convence = parseInt(basic * 0.2);
      const medical = parseInt(basic * 0.08333);
      let incentive = 0,
        advance = 0,
        others = 0;
      let grossSalary = parseInt(
        basic + hra + da + convence + medical + incentive + advance + others
      );

      // Calculate deductions
      const cpf = Math.min(parseInt((basic + da) * 0.12), 1800);
      const esi = parseInt((basic + da + hra + convence + medical) * 0.0075);
      let prof_tax = (calculatePT(basic));
      let tds =0,
        advance_deduction =0,
        others_deduction=0;
      let totalDeductions = parseInt(
        cpf + esi + prof_tax + tds + advance_deduction + others_deduction
      );
      let netSalary = parseInt(grossSalary - totalDeductions);
      console.log("console" , netSalary)

      const absentDays = await calculateAbsentDays(employee.EmpID, month);
      console.log("absent days total at last" , absentDays);
      if (absentDays > 0) {
        console.log("absent days inside if block",absentDays)
        const year =getCurrentYear();
        const monthnum =  getMonthNumberAndDays(month).monthNumber;
        console.log("month in number " ,monthnum)
        console.log("get month days", typeof getDaysInMonth(monthnum ,year));
        console.log("pased month" , month);
        console.log("gross salary" , grossSalary)
        console.log("net salary" , totalDeductions)
        const singleDaySalary = grossSalary / getDaysInMonth(monthnum,year);
        console.log("days deduct",singleDaySalary)
        const absentDeduction = absentDays * (singleDaySalary);
        console.log("total deduction :",absentDeduction)
        others_deduction += absentDeduction;
        totalDeductions += others_deduction;
      }

      // Create salary document
      const salaryData = new Salary({
        EmpID: employee.EmpID,
        month: `${month} ${year}`,
        income: {
          basic,
          da,
          hra,
          medical,
          convence,
          incentive,
          advance,
          others,
        },
        deductions: {
          cpf,
          esi,
          prof_tax,
          tds,
          advance: parseInt(advance_deduction),
          others: parseInt(others_deduction),
        },
        netIncome: parseInt(netSalary),
      });
      console.log("salary details", salaryData);
      salaryRecords.push(salaryData);
    }

    // Save all salary records in the database
    await Salary.insertMany(salaryRecords);

    res.status(200).json({
      message: "Salaries calculated and saved successfully",
      records: salaryRecords.length,
    });
  } catch (error) {
    console.error("Error saving salaries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const router = express.Router();

// Route to generate salary and PDF
// const generateSalary= async (req, res) => {
//     try {
//         const { startId, endId } = req.body;
//         const employees = await EmpMaster.find({
//             EmpID: { $gte: startId, $lte: endId }
//         });

//         if (employees.length === 0) {
//             return res.status(404).json({ message: "No employees found in the given range" });
//         }

//         let salarySlips = [];

//         for (let emp of employees) {
//             let { hra, da, convence, medical, incentive, grossSalary, cpf, esi, prof_tax, tds, totalDeductions, netSalary } = calculateSalary(emp.basicSalary);

//             let salaryData = {
//                 employeeId: emp.EmpID,
//                 name: emp.EmpName,
//                 designation: emp.Designation,
//                 department: emp.Department,
//                 basic: emp.basic,
//                 hra,
//                 da,
//                 convence,
//                 medical,
//                 incentive,
//                 // grossSalary,
//                 cpf,
//                 esi,
//                 prof_tax,
//                 tds,
//                 // totalDeductions,
//                 netSalary,
//                 payPeriod: "January 2025",
//                 daysWorked: 31
//             };

//             let pdfPath = await generateSalaryPDF(salaryData);
//             salaryData.pdfPath = pdfPath;

//             let newSlip = new salarySlip(salaryData);
//             await newSlip.save();

//             salarySlips.push(salaryData);
//         }

//         res.status(200).json({ message: "Salary slips generated and PDFs created", salarySlips });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// Helper function to convert numbers to words (simplified version)

module.exports = {
  addSalary,
  addOrUpdateSalary,
  getSalaryByEmpId,
  deleteSalary,
  //   generateSalaryPDF,
  generateSalary,
  saveSalaries,calculateAbsentDays
};
