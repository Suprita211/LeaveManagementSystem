const express = require("express");
const connectDB = require("./config/db");
// const employeeRoutes = require('./routes/employeeRoutes');
const salaryRoutes = require("./routes/salaryRoutes");
const authRoutes = require("./routes/authRoutes");
// const protectedRoutes = require('./routes/protectedRoutes');

// const empRoutes = require("./routes/employeeroutes copy");

require("dotenv").config();
const cors = require("cors");

//from server.js
const mongoose = require('mongoose');
const empMasterRoutes = require('./routes/EmpMasterRoutes'); // Import employee routes
const empLeaveRoutes = require('./routes/leaveApplicationRoutes');

const adminRoutes= require('./routes/AdminRoutes');
require('./routes/cronJobs');
const path = require('path');
const customizedLeaveRoute = require('./routes/customizesleaveRoute');

const empRoutes  = require('./routes/EmpMasterRoutes');
// const authRoutes = require('./routes/authRoutes');
const absentRoutes = require('./routes/AbsentRoutes');
//end

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Connect to Database
connectDB();

app.use(express.urlencoded({ extended: true })); // Fix empty req.body issue 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// app.use('/api/employees', employeeRoutes);
app.use("/api/employees/salaries", salaryRoutes);
app.use("/api", empRoutes);
// app.use('/api', protectedRoutes);

// app.use('/api',empRoutes);
app.use("/auth", authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/leave', empLeaveRoutes);

app.use('/api/leave1', customizedLeaveRoute);

app.use('/api/abs', absentRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
