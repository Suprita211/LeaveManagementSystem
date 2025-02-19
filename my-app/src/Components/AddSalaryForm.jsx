import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  TableContainer,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toWords } from "number-to-words";

const currentYear = new Date().getFullYear();
const months = Array.from({ length: 12 }, (_, index) => {
  const monthName = new Date(0, index).toLocaleString("en", { month: "long" });
  return {
    value: `${index + 1}-${currentYear}`,
    label: `${monthName} ${currentYear}`,
  };
});

const AddSalaryForm = () => {
  const salaryRef = useRef(null);
  const [EmpID, setEmpID] = useState("");
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [employeeDetails, setEmployeeDetails] = useState({
    EmpName: "",
    Designation: "",
    department: "",
    Company: "",
    UAN: "",
    DateOfJoining: "",
    leaves: { CL: 0, SL: 0, ML: 0 },
    basic: 0,
  });
  const [salary, setSalary] = useState({
    month: months[0].value,
    income: {
      basic: 0,
      da: 0,
      hra: 0,
      convence: 0,
      medical: 0,
      incentive: 0,
      advance: 0,
      others: 0,
    },
    deductions: { cpf: 0, esi: 0, prof_tax: 0, tds: 0, advance: 0, others: 0 },
    netIncome: 0,
  });

  useEffect(() => {
    document.title = "Add Salary";
    const basic = parseInt(salary.income.basic, 10);
    const da = parseInt(basic * 0.4);
    const hra = parseInt(basic * 0.2);
    const convence = parseInt(basic * 0.2);
    const medical = parseInt(basic * 0.08333);

    setSalary((prev) => ({
      ...prev,
      income: { ...prev.income, da, hra, convence, medical },
      deductions: {
        ...prev.deductions,
        cpf: Math.min((basic + da) * 0.12, 1800),
        esi: parseInt((basic + da + hra + convence + medical) * 0.0075),
        prof_tax: calculatePT(basic),
      },
    }));
  }, [salary.income.basic]);

  useEffect(() => {
    if (salary.month) {
      const [month, year] = salary.month.split("-").map(Number);
      setDaysInMonth(getDaysInMonth(month, year));
    }
  }, [salary.month]);

  useEffect(() => {
    const totalIncome = Object.values(salary.income).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(salary.deductions).reduce(
      (a, b) => a + b,
      0
    );
    setSalary((prev) => ({
      ...prev,
      netIncome: totalIncome - totalDeductions,
    }));
  }, [salary.income, salary.deductions]);

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

  const handleChange = (e, category) => {
    const { name, value } = e.target;
    setSalary((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: parseInt(value || 0, 10) },
    }));
  };

  const handleEmpIDChange = async (e) => {
    const empID = e.target.value;
    setEmpID(empID);
    if (!empID)
      return setEmployeeDetails({
        EmpName: "",
        Designation: "",
        Company: "",
        department: "",
        UAN: "",
        DateOfJoining: "",
        leaves: { CL: 0, SL: 0, ML: 0 },
        basic: 0,
      });

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/employee/empID/${empID}`
      );
      console.log(data);
      setEmployeeDetails({
        EmpName: data.EmpName || "",
        Designation: data.Designation || "",
        Company: data.Company || "",
        department: data.Department || "",
        UAN: data.UAN || "",
        DateOfJoining: data.DateOfJoining || "",
        leaves: {
          CL: data.CL || 0,
          SL: data.SL || 0,
          ML: data.ML || 0,
        },
        basic: data.basic || 0, // Set basic from API response
      });
      console.log(data.basic);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setEmployeeDetails({
        EmpName: "",
        Designation: "",
        Company: "",
        department: "",
        UAN: "",
        DateOfJoining: "",
        leaves: { CL: 0, SL: 0, ML: 0 },
        basic: 0,
      });
    }
  };

  const handleSubmit = async () => {
    if (!EmpID) return alert("Please provide a valid Employee ID");

    try {
      const salaryData = {
        EmpID,
        month: salary.month,
        income: Object.fromEntries(
          Object.entries(salary.income).map(([k, v]) => [k, parseInt(v, 10)])
        ),
        deductions: Object.fromEntries(
          Object.entries(salary.deductions).map(([k, v]) => [
            k,
            parseInt(v, 10),
          ])
        ),
        netIncome: salary.netIncome,
      };

      await axios.post(
        `http://localhost:5000/api/employees/salaries/${EmpID}/salary`,
        salaryData
      );
      alert("Salary added successfully");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error processing request");
    }
  };

  const downloadSalarySlip = async () => {
    const canvas = await html2canvas(salaryRef.current, { scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      10,
      10,
      190,
      (canvas.height * 190) / canvas.width
    );
    pdf.save(`Salary_Slip_${EmpID}_${salary.month}.pdf`);
  };

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

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        p: 3,
        boxShadow: 1,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Salary Management
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Employee ID"
            value={EmpID}
            onChange={handleEmpIDChange}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Month"
            value={salary.month}
            onChange={(e) => setSalary({ ...salary, month: e.target.value })}
            variant="outlined"
            size="small"
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value} dense>
                {month.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Name"
            value={employeeDetails.EmpName}
            variant="standard"
            size="small"
            disabled
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Designation"
            value={employeeDetails.Designation}
            variant="standard"
            size="small"
            disabled
          />
        </Grid>
      </Grid>

      <Box
        ref={salaryRef}
        sx={{
          p: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.default",
          mb: 3,
        }}
      >
        <Box textAlign="center" mt={2} mb={2}>
          <Typography variant="h6" fontWeight="bold" mb={1} textAlign="center">
            {employeeDetails.Company}
          </Typography>
          <Typography variant="body2">
            Pioneer Tower, Street No. 85, Opposite tank No. 2, 1st Floor,
            <br />
            Action Area - 1, Plot - AB-109, Newtown,
            <br />
            West Bengal 700156
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
          Payslip
        </Typography>

        <Table sx={{ width: "100%", mb: 3, mt: 1 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ minWidth: 150 }}>Employee ID:</TableCell>
              <TableCell sx={{ gap: 2 }}>{EmpID}</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Date of Join:</TableCell>
              <TableCell>{formatDate(employeeDetails.DateOfJoining)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Employee Name:</TableCell>
              <TableCell>{employeeDetails.EmpName}</TableCell>
              <TableCell>Pay Period:</TableCell>
              <TableCell>
                {months.find((m) => m.value === salary.month)?.label}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Designation:</TableCell>
              <TableCell>{employeeDetails.Designation}</TableCell>
              <TableCell>Days Worked:</TableCell>
              <TableCell>{daysInMonth}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Department:</TableCell>
              <TableCell>{employeeDetails.department}</TableCell>
              <TableCell>UAN Number:</TableCell>
              <TableCell>{employeeDetails.UAN}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <TableContainer component={Paper} variant="outlined">
          <Table
            size="small"
            sx={{ "& .MuiTableCell-root": { py: 0.5, lineHeight: 1 } }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "30%", fontWeight: "bold" }}>
                  Income
                </TableCell>
                <TableCell sx={{ width: "20%", fontWeight: "bold" }}>
                  Amount
                </TableCell>
                <TableCell sx={{ width: "30%", fontWeight: "bold" }}>
                  Deductions
                </TableCell>
                <TableCell sx={{ width: "20%", fontWeight: "bold" }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(salary.income).map((key, i) => (
                <TableRow key={key}>
                  <TableCell sx={{ py: 1 }}>{key.toUpperCase()}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      name={key}
                      value={salary.income[key]}
                      onChange={(e) => handleChange(e, "income")}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        // readOnly: key === 'basic' // Make basic field read-only
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1, align: "right" }}>
                    {Object.keys(salary.deductions)[i]?.toUpperCase()}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      name={Object.keys(salary.deductions)[i]}
                      value={Object.values(salary.deductions)[i]}
                      onChange={(e) => handleChange(e, "deductions")}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                </TableRow>
              ))}

              {/* Gross Salary Row */}
              <TableRow>
                <TableCell
                  colSpan={1}
                  sx={{ py: 1, borderBottom: "none", fontWeight: "bold" }}
                >
                  Gross Salary
                </TableCell>
                <TableCell
                  colSpan={1}
                  sx={{ py: 1, borderBottom: "none", fontWeight: "bold" }}
                >
                  ₹
                  {Object.values(salary.income)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
                </TableCell>

                {/* Total Deductions Row */}

                <TableCell
                  colSpan={1}
                  sx={{ py: 1, borderBottom: "none", fontWeight: "bold" }}
                >
                  Total Deductions
                </TableCell>
                <TableCell
                  colSpan={1}
                  sx={{ py: 1, borderBottom: "none", fontWeight: "bold" }}
                >
                  ₹
                  {Object.values(salary.deductions)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>

              {/* Net Salary Row */}
              <TableRow>
                <TableCell
                  colSpan={1}
                  sx={{ py: 1.5, borderBottom: "none", fontWeight: "bold" }}
                >
                  Net Salary
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{ py: 1.5, borderBottom: "none", fontWeight: "bold" }}
                >
                  ₹{salary.netIncome.toLocaleString()}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ lineHeight: 1.2 }}
                  >
                    ({toWords(salary.netIncome)})
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Leave and Balance Section */}
        <Box sx={{ mt: 2, borderTop: 1, borderColor: "divider", pt: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Leave Balance:
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <span>SL: {employeeDetails.leaves?.SL || 0}</span>
              <span>CL: {employeeDetails.leaves?.CL || 0}</span>
              <span>ML: {employeeDetails.leaves?.ML || 0}</span>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" fontWeight="bold">
              Balance Amounts:
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <span>Loan: ₹0</span>
              <span>Advance: ₹0</span>
            </Box>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button variant="contained" onClick={handleSubmit}>
            Save Details
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={downloadSalarySlip}
            color="secondary"
          >
            Download Slip
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddSalaryForm;
