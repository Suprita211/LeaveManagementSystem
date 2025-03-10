import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Grid, Typography, Box, Alert, Table, TableBody, TableCell, TableContainer, TableRow, Paper
} from '@mui/material';

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
        setUpdatedEmployee(response.data);
        setError('');
      })
      .catch(() => {
        setEmployee(null);
        setError('Employee not found!');
      });
  };

  // Update Employee Details
  const updateEmployee = () => {
    axios.put(`http://localhost:8080/api/empID/${updatedEmployee.EmpID}`, updatedEmployee)
      .then((response) => {
        setEmployee(response.data);
        alert('Employee details updated successfully.');
        setError('');
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
              <Grid container spacing={2} sx={6}>
                <Grid item xs={12}>
                  <TextField label="Name" name="EmpName" value={updatedEmployee.EmpName || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Company Name" name="CompanyName" value={updatedEmployee.CompanyName || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Department" name="Department" value={updatedEmployee.Department || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Designation" name="Designation" value={updatedEmployee.Designation || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email" name="EmployeeEmailID" value={updatedEmployee.EmployeeEmailID || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Aadhar No." name="AadharNumber" value={updatedEmployee.AadharNumber || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="PAN No." name="PANNumber" value={updatedEmployee.PANNumber || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Residence Address" name="ResidenceAddress" value={updatedEmployee.ResidenceAddress || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Primary Contact" name="PrimaryContactNumber" value={updatedEmployee.PrimaryContactNumber || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Secondary Contact" name="SecondaryContactNumber" value={updatedEmployee.SecondaryContactNumber || ''} fullWidth onChange={handleChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Date of Joining" name="DateOfJoining" value={updatedEmployee.DateOfJoining?.slice(0, 10) || ''} fullWidth onChange={handleChange} variant="outlined" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Birth Date" name="BirthDate" value={updatedEmployee.BirthDate?.slice(0, 10) || ''} fullWidth onChange={handleChange} variant="outlined" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField label="Retirement Date" name="RetirementDate" value={updatedEmployee.RetirementDate?.slice(0, 10) || ''} fullWidth onChange={handleChange} variant="outlined" type="date" InputLabelProps={{ shrink: true }} />
                </Grid> */}

                {/* added */}
                <Grid item xs={12}>
                  <TextField label="Gender" name="Gender" value={updatedEmployee.Gender || ''} fullWidth onChange={handleChange} variant="outlined" type="text" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Marrital Status" name="MarriedStatus" value={updatedEmployee.MarriedStatus || ''} fullWidth onChange={handleChange} variant="outlined" type="text" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Guardian Name" name="GuardianSpouseName" value={updatedEmployee.GuardianSpouseName || ''} fullWidth onChange={handleChange} variant="outlined" type="text" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="UAN Number" name="UAN" value={updatedEmployee.UAN || ''} fullWidth onChange={handleChange} variant="outlined" type="text" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Basic Salary" name="basic" value={updatedEmployee.basic || ''} fullWidth onChange={handleChange} variant="outlined" type="text" InputLabelProps={{ shrink: true }} />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={updateEmployee}>Update</Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditable(false)}>Cancel</Button>
              </Box>
            </form>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableBody>
                  <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell><TableCell>{employee.EmpName}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell><TableCell>{employee.CompanyName}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell><TableCell>{employee.Department}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell><TableCell>{employee.Designation}</TableCell></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setIsEditable(true)}>Edit</Button>
            <Button variant="outlined" color="secondary" onClick={deleteEmployee}>Delete</Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ViewSingleEmployee;
