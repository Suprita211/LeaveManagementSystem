// require('dotenv').config()
// const mongoose = require('mongoose');
// const cors = require('cors');
// const empMasterRoutes = require('./routes/EmpMasterRoutes'); // Import employee routes
// const empLeaveRoutes = require('./routes/leaveApplicationRoutes');
// const salaryRoutes = require('./routes/salaryRoutes');

// const adminRoutes= require('./routes/AdminRoutes');
// require('./routes/cronJobs');
// const path = require('path');
// const customizedLeaveRoute = require('./routes/customizesleaveRoute');

// const empRoutes  = require('./routes/EmpMasterRoutes');
// const authRoutes = require('./routes/authRoutes');

// const express = require('express');

// const app = express();


const app = require('./app');

const PORT = process.env.PORT || 8080;

// // Middleware
// app.use(cors());// Enable CORS for all routes (allow requests from any origin)
// app.use(express.json()); // Allow body parsing for JSON data

// app.use(express.urlencoded({ extended: true })); // Fix empty req.body issue 
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB Connection
// const DB_CONNECTION_STRING = process.env.connection_string


// mongoose
//   .connect(DB_CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Database connection error:', err.message));

// Routes
// app.use('/api/employee', empMasterRoutes);
// app.use('/api/leave', empLeaveRoutes);

// app.use('/api/admin',adminRoutes);

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// app.use('/api/employees/salaries', salaryRoutes);
// app.use('/api',empRoutes);
// app.use('/auth', authRoutes);

// app.use('/api/leave1', customizedLeaveRoute);
// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});                
