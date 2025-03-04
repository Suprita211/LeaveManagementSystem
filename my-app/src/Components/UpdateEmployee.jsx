import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Grid, Typography, Box, Alert, Table, TableBody, TableCell, TableContainer, TableRow, Paper
} from '@mui/material';
const {API_URL_PROD} = process.env;

const ViewSingleEmployee = () => {
  const [empID, setEmpID] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState({});

  // Fetch Employee by EmpID
  const fetchEmployee = () => {
    const inputEmpID = empID.trim();

    if (!inputEmpID) {
      setError('Please enter a valid Employee ID.');
      setEmployee(null);
      return;
    }

    axios.get(`https://ems-be-v1.onrender.com/api/singleemployee/empID/${inputEmpID}`)
      .then((response) => {
        setEmployee(response.data);
        setUpdatedEmployee(response.data); // Populate the form with current data
        setError('');
      })
      .catch(() => {
        setEmployee(null);
        setError('Employee not found!');
      });
  };

  // Update Employee Details
  const updateEmployee = () => {
    if (Object.values(updatedEmployee).includes('')) {
      setError('All fields are required for updating.');
      return;
    }

    axios.put(`https://ems-be-v1.onrender.com/api/empID/${updatedEmployee.EmpID}`, updatedEmployee)
      .then((response) => {
        setEmployee(response.data);
        alert('Employee details updated successfully.');
        setError('Employee details updated successfully.');
        setIsEditable(false);
      })
      .catch(() => {
        setError('Error updating employee.');
      });
  };

  // Delete Employee
  const deleteEmployee = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      axios.delete(`https://ems-be-v1.onrender.com/api/employee/empID/${employee.EmpID}`)
        .then(() => {
          setEmployee(null);
          setError('Employee deleted successfully.');
        })
        .catch(() => {
          setError('Error deleting employee.');
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Employee details to display in the table
  const employeeDetails = [
    
    { key: 'Name', value: employee?.EmpName },
    { key: 'Company Name', value: employee?.CompanyName },
    { key: 'Department', value: employee?.Department },
    { key: 'Designation', value: employee?.Designation },
    { key: 'Email', value: employee?.EmployeeEmailID },
    { key: 'Aadhar No.', value: employee?.AadharNumber },
    { key: 'PAN No.', value: employee?.PANNumber },
    { key: 'Residence Address', value: employee?.ResidenceAddress },
    { key: 'Primary Contact', value: employee?.PrimaryContactNumber },
    { key: 'Secondary Contact', value: employee?.SecondaryContactNumber },
    { key: 'Date of Joining', value: employee?.DateOfJoining?.slice(0, 10) },
    { key: 'Birth Date', value: employee?.BirthDate?.slice(0, 10) },
    { key: 'Retirement Date', value: employee?.RetirementDate?.slice(0, 10) },
    { key: 'ML', value: employee?.ML },
    { key: 'CL', value: employee?.CL },
    { key: 'Gender', value: employee?.Gender },
    { key: 'Marital Status', value: employee?.MarriedStatus },
    { key: 'Guardian/Spouse Name', value: employee?.GuardianSpouseName },
    { key: 'UAN No.', value: employee?.UAN },
    { key: 'Basic Salary', value: employee?.basic },
  ];

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Search Employee
      </Typography>

      <TextField
        label="Enter Employee ID"
        variant="outlined"
        fullWidth
        value={empID}
        onChange={(e) => setEmpID(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" fullWidth onClick={fetchEmployee} sx={{ marginBottom: 2 }}>
        Search
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {employee && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Employee Details
          </Typography>
          {isEditable ? (
            <form>
              <Grid container spacing={2}>
                {employeeDetails.map((detail, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label={detail.key}
                      name={detail.key.replace(/\s+/g, '')} // Remove spaces for field names
                      value={updatedEmployee[detail.key.replace(/\s+/g, '')] || ''}
                      fullWidth
                      onChange={handleChange}
                      variant="outlined"
                      type={detail.key.includes('Date') ? 'date' : 'text'}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={updateEmployee}>
                  Update
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditable(false)}>
                  Cancel
                </Button>
              </Box>
            </form>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableBody>
                  {employeeDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 'bold' }}>{detail.key}</TableCell>
                      <TableCell>{detail.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setIsEditable(true)}>
              Edit
            </Button>
            <Button variant="outlined" color="secondary" onClick={deleteEmployee}>
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ViewSingleEmployee;