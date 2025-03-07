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
const BankSchema = require('../models/BankModel'); // Adjust path as necessary


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

  if (num === 0) return "Rupees zero only";

  // Converts an integer number into words.
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

  // Separate integer and decimal parts
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  // Build the final string
  let words = `Rupees ${convertToWords(integerPart)}`;
  if (decimalPart > 0) {
    words += ` and ${convertToWords(decimalPart)} paise`;
  }
  words += " only";

  return words;
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
  return new Date(year, month, 0).getDate();
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
      Month: new RegExp(`^${month}\\s\\d{4}$`, "i"), // Match "February 2026" dynamically
    });

    if (!absent) {
      console.log(
        `❌ No absent record found for EmpID: "${empId}" and Month: "${month}"`
      );
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
    console.log("absent days", AbsentDays.data.DaysAbsent);
    const TotalAbsentDays = AbsentDays.data.DaysAbsent || 0;
    console.log(TotalAbsentDays);

    const Rejecteddays = await getLeaveByEmpIDAndMonth(empId, month);
    console.log("rejected data", Rejecteddays);
    const totalLeavesApplied = Rejecteddays || 0;

    // Calculate final absent days
    // Final = Absent days + Rejected leaves - Total leaves applied
    const finalAbsentDays = Math.max(0, TotalAbsentDays - totalLeavesApplied);
    console.log("final absent days", finalAbsentDays);

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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Log the input month
    console.log(`Input Month: "${month}"`);

    if (!monthNames.includes(month)) {
      throw new Error(`Invalid month name provided: "${month}"`);
    }

    // Fetch rejected leave requests for the employee
    const leaves = await CustomizeLeave.find({
      employeeId: empId,
      approvalStatus: "Rejected",
    }).select("numOfDays createdAt");

    console.log("Fetched rejected leaves:", leaves);

    // Filter by month only (ignoring year)
    const filteredLeaves = leaves.filter((leave) => {
      const leaveMonth = `"${
        monthNames[new Date(leave.createdAt).getMonth()]
      }"`; // Convert to string with double quotes
      console.log(`Leave Month from DB: ${leaveMonth}`);

      return leaveMonth === `"${month}"`;
    });

    // Extract numOfDays values
    const rejectedDaysArray = filteredLeaves.map((leave) => leave.numOfDays);

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

const getMonthNumberAndDays = (monthName) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Convert month name to the month index (0-based, so January is 0, May is 4, etc.)
  const monthIndex = monthNames.findIndex(
    (name) => name.toLowerCase() === monthName.toLowerCase()
  );

  if (monthIndex === -1) {
    return `Invalid month name: ${monthName}`; // If the month is invalid
  }

  const year = new Date().getFullYear(); // Get the current year
  const monthNumber = monthIndex + 1; // Month number (1-based, so January is 1, May is 5, etc.)
  const daysInMonth = getDaysInMonth(monthNumber, year);

  return { monthNumber, daysInMonth };
};

/**
 * @desc Generate salary slip PDF for an employee
 * @route GET /api/salary/salary-slip/:id/:month
 */
const generateSalary = async (req, res) => {
  try {
    const { startId, endId, month, year } = req.body;

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
      const monthYear = `${month} ${year}`;

      const salaryData = await Salary.findOne(
        { EmpID: employee.EmpID, month: monthYear },
        { _id: 0 }
      );
      if (!salaryData) continue;

      if (!employee) {
        console.log(`No employee found with ID: ${empId}`);
        return null;
      }

      const pdfPath = path.join(
        pdfDirectory,
        `salary_slip_${employee.EmpID}.pdf`
      );

      const grossSalary = parseFloat(
        salaryData.income.basic +
          salaryData.income.da +
          salaryData.income.hra +
          salaryData.income.convence +
          salaryData.income.medical +
          salaryData.income.incentive +
          salaryData.income.advance +
          salaryData.income.others
      ).toFixed(2);
      const totalDeductions = parseFloat(
        salaryData.deductions.cpf +
          salaryData.deductions.esi +
          salaryData.deductions.prof_tax +
          salaryData.deductions.others +
          salaryData.deductions.tds +
          salaryData.deductions.advance
      ).toFixed(2);

      const absentDays = await calculateAbsentDays(employee.EmpID, month);
      // console.log("absent days total at last", absentDays);

      const bankData = await BankSchema.findOne({ EmpID: employee.EmpID });


      // Generate HTML for PDF
      const htmlContent = `
                               <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PaySlip</title>
    <style>
        body{
            font-family: Arial, Helvetica, sans-serif;
        }

      .container {
        height: 90vh;
        /* margin: 1rem; */
        border: 1px solid #000;
        
      }

      .header {
        display: grid;
        grid-template-columns: 1fr 6fr 1fr;
        /* gap: 10px; */
        align-items: center;
        /* margin: 4vh */
      }

      .item {
        text-align: center;
      }

      .item img {
        width: 10vw;
        height: auto;
        margin-left: 4rem;
      }

      .subhead {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        margin-top: -1rem;
      }

      .grid-container {
        display: grid;
        grid-template-columns: 130px 280px 120px auto;
        /* gap: 10px; */
        margin-left: 4rem;
        /* background-color: dodgerblue; */
      }

      .grid-container > div {
        /* background-color: #f1f1f1; */
        color: #000;
        /* padding: 5px; */
        font-size: 16px;
        text-align: left;
      }

      .table {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Ensure only 2 rows on the left and 2 on the right */
      .table .th:nth-child(1),
      .table .th:nth-child(4) {
        width: 24vw;
        /* Left column */
      }

      .table .th:nth-child(3) {
        width: 1vw;
        /* Left column */
      }

      .table .th:nth-child(2),
      .table .th:nth-child(5) {
        width: 12vw;
        text-align: right;
        /* Right column */
      }

      table {
        width: 85%;
        border-collapse: collapse;
        margin-top: 2rem;
      }

      th,
      td {
        border: 0.5px solid #d3d3d3;
        /* padding: 4px; */
        text-align: left;
      }

      .bank-det {
        margin: 3vw;
        margin-left: 5vw;
      }
      .h3 {
        margin-left: 1rem;
      }

      .banks {
        display: grid;
        grid-template-columns: 20vw 50vw;
        padding: 1vw 0;
        margin-bottom: -1rem;
        margin-left: 1rem;
      }

      .footer {
        /* margin-top: 15px; */
        line-height: 1.6;
        margin-left: 3.3rem;
      }

      .footer h4 {
        margin-left: 35%;
      }

      #last {
        margin-bottom: 4%;
        margin-left: 35px;
      }

      .h5 {
        margin-left: 5rem;
      }

      .signature-box {
        text-align: right;
        font-family: Arial, sans-serif;
        margin-top: 50px;
        margin-right: 4rem;
      }

      .signature-line {
        display: inline-block;
        width: 162px;
        border-top: 1px dashed #000;
        margin-bottom: 5px;
      }

      .signatory-text {
        font-size: 16px;
        font-weight: bold;
        color: #000;
      }
      .h4 {
        /* font-family: Verdana, Geneva, Tahoma, sans-serif; */
        margin-top: 10rem;
        font-weight: normal;
      }

      .tr{
      margin-bottom : 10px;}
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <div class="item">
          <img
            src="https://pgssw.co.in/assets/admin-source/images/logo.png"
            alt=""
          />
        </div>
        <div class="item">
          <h2>${employee.CompanyName}</h2>
          <p>
            "Pioneer Tower", Premises No.20-085 <br />
            Street No.85,AB-109, New Town, Kolkata-700163 <br />
            Ph: 9007938111, email: pioneer.surveyors@gmail.com
          </p>
        </div>
        <div class="item"></div>
      </div>

      <div class="subhead">
        <h3><u>Pay Slip</u></h3>
      </div>

      <div class="card">
        <div class="grid-container">
          <div>Employee ID</div>
          <div>: &nbsp; ${employee.EmpID}</div>
          <div>Date of Joining</div>
          <div>: &nbsp; ${formatDate(employee.DateOfJoining)}</div>
        </div>
        <div class="grid-container">
          <div>Employee Name</div>
          <div>: &nbsp; ${employee.EmpName}</div>
          <div>Pay period</div>
          <div>: &nbsp; ${month}
                  ${getCurrentYear()}</div>
        </div>
        <div class="grid-container">
          <div>Designation</div>
          <div>: &nbsp; ${employee.Designation}</div>
          <div>Days Worked</div>
          <div>: &nbsp; ${
            getMonthNumberAndDays(getCurrentMonthName()).daysInMonth -
            absentDays
          }</div>
        </div>
        <div class="grid-container">
          <div>Department</div>
          <div>: &nbsp; ${employee.Department}</div>
          <div>UAN Number</div>
          <div>: &nbsp; ${employee.PANNumber}</div>
        </div>
      </div>

      <div class="table">
        <table>
          <thead>
            <tr class="tr">
              <th class="th">&nbsp;Earnings</th>
              <th class="th">Amount(₹)&nbsp;</th>
              <th class="th"></th>
              <th class="th">&nbsp;Deductions</th>
              <th class="th">Amount(₹)&nbsp;</th>
            </tr>
          </thead>
          <tr class="tr">
            <td class="th">&nbsp;Basic Salary</td>
            <td class="th">${(Math.round(salaryData.income.basic * 100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;Provident Fund (PF)</td>
            <td class="th">${(Math.round(salaryData.deductions.cpf * 100)/100).toFixed(2)}&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th">&nbsp;Dearness Allowance (DA)</td>
            <td class="th">${(Math.round(salaryData.income.da *100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;ESI</td>
            <td class="th">${(Math.round(salaryData.deductions.esi *100)/100).toFixed(2)}&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th">&nbsp;House rent Allowance (HRA)</td>
            <td class="th">${(Math.round(salaryData.income.hra *100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;Professional Tax</td>
            <td class="th">${(Math.round(salaryData.deductions.prof_tax*100)/100).toFixed(2)}&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th">&nbsp;Conveyance Allowance</td>
            <td class="th">${(Math.round(salaryData.income.convence *100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;Income Tax (TDS)</td>
            <td class="th">${(Math.round(salaryData.deductions.tds*100)/100).toFixed(2)}&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th">&nbsp;Medical Allowance</td>
            <td class="th">${(Math.round(salaryData.income.medical*100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;Advance</td>
            <td class="th">${(Math.max(salaryData.deductions.advance*100)/100).toFixed(2)}&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th">&nbsp;Incentive</td>
            <td class="th">${(Math.round(salaryData.income.incentive*100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;Other deductions</td>
            <td class="th">${(Math.round(salaryData.deductions.others*100)/100).toFixed(2)}&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th">&nbsp;Advance</td>
            <td class="th">${(Math.round(salaryData.income.advance*100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;</td>
            <td class="th">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th">&nbsp;Other Allowances</td>
            <td class="th">${(Math.round(salaryData.income.others*100)/100).toFixed(2)}&nbsp;</td>
            <td class="th"></td>
            <td class="th">&nbsp;</td>
            <td class="th">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="th"><strong>&nbsp;Gross Salary</strong></td>
            <td class="th">${(Math.round(grossSalary*100)/100).toFixed(2)}&nbsp;</td>
            <td></td>
            <td class="th"><strong>&nbsp;Total Deductions</strong></td>
            <td class="th">${(Math.round(totalDeductions*100)/100).toFixed(2)}&nbsp;</td>
          </tr>
          <tr>
          <tr class="tr">
          <td></td><td></td><td></td><td></td><td></td></tr>
            <td><strong>&nbsp;Net Salary(₹)</strong></td>
            <td colspan="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${(Math.round(salaryData.netIncome*100)/100)} 
            </td>
          </tr>
          <tr>
          <td>Amount in words:</td>
          <td colspan="4">${numberToWords(
        salaryData.netIncome)
      }</td>
          </tr>

        </table>
      </div>

      <div class="bank-det">
        <h3 class="h3"><u>Employee's Bank Details:</u></h3>

        <div class="banks">
          <div class="pros">Name of the Bank</div>
          <div class="pros">: &nbsp;${bankData.bankName}</div>
          <div class="pros">Account No.</div>
          <div class="pros">: &nbsp;${bankData.Acc_no}</div>
          <div class="pros">IFSC Code</div>
          <div class="pros">: &nbsp;${bankData.IFSC_no}</div>
          <div class="pros">Mode of Payment</div>
          <div class="pros">: &nbsp;${bankData.paymentMode}</div>
        </div>
      </div>

      <div class="footer">
        <div><strong>Leave Balance:</strong> CL: ${employee.CL} | ML: ${employee.ML}</div>
        <div><strong>Balance Amounts:</strong>Loan: ₹${
              Salary.others || 0
            } | Advance: ₹${Salary.advance || 0}</div>
      </div>

      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signatory-text">Authorised Signatory</div>
      </div>
      <h5 class="h4" style="text-align: center">
        A unit of Pioneer Group of Companies
      </h5>
    </div>
  </body>
</html>
`;

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

    const salaryRecords = [];

    for (let employee of employees) {
      // Calculate income components
      const basic = parseFloat(((employee.basic || 0 )));
      const hra = parseFloat((basic * 0.2));
      const da = parseFloat((basic * 0.4));
      const convence = parseFloat((basic * 0.2));
      const medical = parseFloat((basic * 0.08333));
      let incentive = 0,
        advance = 0,
        others = 0;
      let grossSalary = parseFloat(
        basic + hra + da + convence + medical + incentive + advance + others
      ).toFixed(2);

      // Calculate deductions
      const cpf = parseFloat(Math.min((((basic + da) * 0.12), 1800)));
      const esi = parseFloat(((basic + da + hra + convence + medical) * 0.0075));
      let prof_tax = parseFloat((calculatePT(basic)));
      let tds = 0,
        advance_deduction = 0,
        others_deduction = 0;
      let totalDeductions = parseFloat(
        cpf + esi + prof_tax + tds + advance_deduction + others_deduction
      ).toFixed(2);
      let netSalary = parseFloat(grossSalary - totalDeductions);
      console.log("console", netSalary);

      const absentDays = await calculateAbsentDays(employee.EmpID, month);
      console.log("absent days total at last", absentDays);
      if (absentDays > 0) {
        console.log("absent days inside if block", absentDays);
        const year = getCurrentYear();
        const monthnum = getMonthNumberAndDays(month).monthNumber;
        console.log("month in number ", monthnum);
        console.log("get month days", typeof getDaysInMonth(monthnum, year));
        console.log("pased month", month);
        console.log("gross salary", grossSalary);
        console.log("net salary", totalDeductions);
        const singleDaySalary = grossSalary / getDaysInMonth(monthnum, year);
        console.log("days deduct", singleDaySalary);
        const absentDeduction = absentDays * singleDaySalary;
        others_deduction += parseFloat(absentDeduction);
        console.log("other deduction :", others_deduction);
        netSalary -= others_deduction;
        totalDeductions += others_deduction;
        console.log("total deduction", totalDeductions);
      }

      // Create salary document
      const salaryData = new Salary({
        EmpID: employee.EmpID,
        month: `${month} ${year}`,
        income: {
          basic: basic.toFixed(2),
          da: da.toFixed(2),
          hra: hra.toFixed(2),
          medical: medical.toFixed(2),
          convence: convence.toFixed(2),
          incentive: incentive.toFixed(2),
          advance: advance.toFixed(2),
          others: others.toFixed(2),
        },
        deductions: {
          cpf: cpf.toFixed(2),
          esi: esi.toFixed(2),
          prof_tax: prof_tax.toFixed(2),
          tds: tds.toFixed(2),
          advance: advance_deduction.toFixed(2),
          others: others_deduction.toFixed(2),
        },
        netIncome: netSalary.toFixed(2),
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

module.exports = {
  addSalary,
  addOrUpdateSalary,
  getSalaryByEmpId,
  deleteSalary,
  generateSalary,
  saveSalaries,
  calculateAbsentDays,
};
