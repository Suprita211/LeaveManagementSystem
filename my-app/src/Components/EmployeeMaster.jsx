import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
const {API_URL_PROD} = process.env;
const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    EmpName: '',
    Designation: '',
    CompanyName: '',
    Department: '',
    ResidenceAddress: '',
    PrimaryContactNumber: '',
    SecondaryContactNumber: '',
    EmployeeEmailID: '',
    AadharNumber : '',
    PANNumber : '',
    DateOfJoining: '',
    BirthDate: '',
    Gender: '',
    MarriedStatus: '',
    GuardianSpouseName: '',
    RetirementDate: '',
    CL: 4,
    SL: 0,
    ML: 2,
    UAN: '',
    basic : 15000
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'BirthDate') {
      calculateRetirementDate(value);
    }
  };

  const calculateRetirementDate = (birthDate) => {
    if (birthDate) {
      const birth = new Date(birthDate);
      const retirementYear = birth.getFullYear() + 60;
      const retirementDate = new Date(birth);
      retirementDate.setFullYear(retirementYear);

      const lastDayOfMonth = new Date(retirementDate.getFullYear(), retirementDate.getMonth() + 1, 0);
      setFormData((prevData) => ({
        ...prevData,
        RetirementDate: lastDayOfMonth.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`https://ems-be-v1.onrender.com/api`, formData);
      
      if (response.status === 201) {
        console.log('Employee added:', formData);
        alert('Employee added successfully');
        setFormData({
          EmpName: '',
          Designation: '',
          CompanyName: '',
          Department: '',
          ResidenceAddress: '',
          PrimaryContactNumber: '',
          SecondaryContactNumber: '',
          EmployeeEmailID: '',
          AadharNumber: '',
          PANNumber : '',
          DateOfJoining: '',
          BirthDate: '',
          Gender: '',
          MarriedStatus: '',
          GuardianSpouseName: '',
          RetirementDate: '',
          CL: 4,
          SL: 8,
          ML: 2,
          UAN: '',
          basic : 0,
        });
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('There was an error adding the employee.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Add New Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Employee Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Name"
                variant="outlined"
                fullWidth
                name="EmpName"
                value={formData.EmpName}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 21 }}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Company */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                variant="outlined"
                fullWidth
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 20 }}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

             {/* Designation */}
             <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                variant="outlined"
                fullWidth
                name="Designation"
                value={formData.Designation}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 6 }}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                variant="outlined"
                fullWidth
                name="Department"
                value={formData.Department}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 10 }}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Residence Address */}
            <Grid item xs={12}>
              <TextField
                label="Residence Address"
                variant="outlined"
                fullWidth
                name="ResidenceAddress"
                value={formData.ResidenceAddress}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 40 }}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Primary Contact */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Primary Contact"
                variant="outlined"
                fullWidth
                name="PrimaryContactNumber"
                value={formData.PrimaryContactNumber}
                onChange={handleChange}
                required
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Secondary Contact */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Secondary Contact"
                variant="outlined"
                fullWidth
                name="SecondaryContactNumber"
                value={formData.SecondaryContactNumber}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                name="EmployeeEmailID"
                value={formData.EmployeeEmailID}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Aadhar */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Aadhar Number"
                variant="outlined"
                fullWidth
                name="AadharNumber"
                value={formData.AadharNumber}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* PAN */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="PAN Number"
                variant="outlined"
                fullWidth
                name="PANNumber"
                value={formData.PANNumber}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Date of Joining */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Joining"
                type="date"
                variant="outlined"
                fullWidth
                name="DateOfJoining"
                value={formData.DateOfJoining}
                onChange={handleChange}
                required
                InputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Birth Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Birth Date"
                type="date"
                variant="outlined"
                fullWidth
                name="BirthDate"
                value={formData.BirthDate}
                onChange={handleChange}
                required
                InputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* UAN Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="UAN Number"
                variant="outlined"
                fullWidth
                name="UAN"
                value={formData.UAN}
                onChange={handleChange}
                required
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Gender Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ fontSize: 16, backgroundColor: '#F5F5F5' }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Marital Status Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="MarriedStatus"
                  value={formData.MarriedStatus}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ fontSize: 16, backgroundColor: '#F5F5F5' }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Guardian/Spouse Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian/Spouse Name"
                variant="outlined"
                fullWidth
                name="GuardianSpouseName"
                value={formData.GuardianSpouseName}
                onChange={handleChange}
                inputProps={{ maxLength: 21 }}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Basic */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Basic Salary"
                variant="outlined"
                fullWidth
                name="basic"
                value={formData.basic}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Leave Balances */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Casual Leave (CL)"
                type="number"
                variant="outlined"
                fullWidth
                name="CL"
                value={formData.CL}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Special Leave (SL)"
                type="number"
                variant="outlined"
                fullWidth
                name="SL"
                value={formData.SL}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Medical Leave (ML)"
                type="number"
                variant="outlined"
                fullWidth
                name="ML"
                value={formData.ML}
                onChange={handleChange}
                InputProps={{ style: { fontSize: 16 } }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{
                  padding: '10px 0',
                  fontSize: 16,
                  fontWeight: 'bold',
                  backgroundColor: '#3f51b5',
                  '&:hover': { backgroundColor: '#303f9f' },
                }}
              >
                Add Employee
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default EmployeeForm;