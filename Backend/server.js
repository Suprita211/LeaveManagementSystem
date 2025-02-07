require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const empMasterRoutes = require('./routes/EmpMasterRoutes'); // Import employee routes
const empLeaveRoutes = require('./routes/leaveApplicationRoutes');
const empRoutes  = require('./routes/employeeroutes');


const path = require('path');
const customizedLeaveRoute = require('./routes/customizesleaveRoute');

const app = express();
app.use(cors(
  {
    origin:["https://deploy-mern-1whq.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }
  ));
const PORT = 8080; // Default port

// Middleware
//app.use(cors());
// Enable CORS for all routes (allow requests from any origin)
app.use(express.json()); // Allow body parsing for JSON data

app.use(express.urlencoded({ extended: true })); // Fix empty req.body issue 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB Connection
const DB_CONNECTION_STRING = process.env.connection_string


mongoose
  .connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err.message));

// Routes
app.use('/api/employee', empMasterRoutes);
app.use('/api/leave', empLeaveRoutes);
app.use('/api',empRoutes);



app.use('/api/leave1', customizedLeaveRoute);
// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});                
