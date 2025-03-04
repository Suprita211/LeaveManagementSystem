import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { toWords } from 'number-to-words';
const {API_URL_PROD} = process.env;

const SalaryForm = ({ empID, onDelete, onUpdate }) => {
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(''); // State for month input

    // Function to fetch salary data when empID or month changes
    const fetchSalaryData = () => {
        if (empID && month) {
            setLoading(true);
            axios
                .get(`https://ems-be-v1.onrender.com/api/employees/salaries/${empID}/salary/${month}`)
                .then((response) => {
                    setSalary(response.data.salary);
                })
                .catch((error) => {
                    console.error('Error fetching salary:', error);
                    setSalary(null);
                })
                .finally(() => setLoading(false));
        }
    };

    const handleUpdate = () => {
        if (salary) {
            const updatedSalary = {
                salary: {
                    income: salary.income, // Assuming salary.income is an object with income details
                    deductions: salary.deductions, // Assuming salary.deductions is an object with deduction details
                    netIncome: calculateNetIncome(), // Assuming netIncome is calculated
                    month: month, // The selected month for salary
                }
            };
    
            axios.put(`https://ems-be-v1.onrender.com/api/employees/salaries/${empID}/salary`, updatedSalary, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => {
                    onUpdate(); // Trigger onUpdate callback
                    alert('Salary updated successfully');
                })
                .catch((error) => {
                    console.error('Error updating salary:', error.response ? error.response.data : error);
                    alert('Error updating salary');
                });
        }
    };
    
    
    

    const handleDelete = () => {
        if (salary) {
            const isConfirmed = window.confirm('Are you sure you want to delete the salary record?');
            if (isConfirmed) {
                axios
                    .delete(`https://ems-be-v1.onrender.com/api/employees/salaries/${empID}/salary/${month}`)
                    .then((response) => {
                        onDelete();
                        alert('Salary record deleted');
                    })
                    .catch((error) => {
                        console.error('Error deleting salary:', error);
                        alert('Error deleting salary');
                    });
            } else {
                console.log('Salary record deletion canceled');
            }
        }
    };

    const calculateNetIncome = () => {
        if (salary) {
            const totalIncome = Object.values(salary.income).reduce((acc, val) => acc + Number(val), 0);
            const totalDeductions = Object.values(salary.deductions).reduce((acc, val) => acc + Number(val), 0);
            return totalIncome - totalDeductions;
        }
        return 0;
    };

    const handleIncomeChange = (field, value) => {
        setSalary({
            ...salary,
            income: { ...salary.income, [field]: value },
        });
    };

    const handleDeductionChange = (field, value) => {
        setSalary({
            ...salary,
            deductions: { ...salary.deductions, [field]: value },
        });
    };

    if (loading) return <Typography>Loading...</Typography>;

    const netIncome = calculateNetIncome();
    const netIncomeInWords = toWords(netIncome);

    return (
        <Box sx={{ padding: 2, border: '1px solid #ccc' }}>
            <Typography variant="h6">Income and Deduction Details</Typography>

            {/* Emp ID and Month Input Fields */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={4}>
                    <TextField
                        label="Employee ID"
                        value={empID}
                        fullWidth
                        disabled
                    />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <TextField
                        label="Month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)} // Controlled input for month
                        fullWidth
                        inputProps={{
                            maxLength: 20, // Set a reasonable character length limit for the month field
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchSalaryData} // Trigger the search on button click
                        sx={{ width: '100%' }}
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>

            {/* Income and Deduction Table side by side */}
            <Grid container spacing={3}>
                {/* Income Table */}
                <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Income Details</Typography>
                        <Grid container spacing={2}>
                            {Object.keys(salary?.income || {}).map((key) => (
                                <Grid item xs={6} key={key}>
                                    <TextField
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        type="number"
                                        value={salary.income[key]}
                                        onChange={(e) =>
                                            handleIncomeChange(key, e.target.value)
                                        }
                                        fullWidth
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                {/* Deductions Table */}
                <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Deductions Details</Typography>
                        <Grid container spacing={2}>
                            {Object.keys(salary?.deductions || {}).map((key) => (
                                <Grid item xs={6} key={key}>
                                    <TextField
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        type="number"
                                        value={salary.deductions[key]}
                                        onChange={(e) =>
                                            handleDeductionChange(key, e.target.value)
                                        }
                                        fullWidth
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Net Income Section */}
            <Paper sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6">Net Income</Typography>
                <TextField
                    label="Net Income"
                    type="text"
                    value={`${netIncome} (${netIncomeInWords} rupees)`} 
                    fullWidth
                    disabled
                />
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    sx={{ mr: 2 }}
                >
                    Update
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDelete}>
                    Delete
                </Button>
            </Box>
        </Box>
    );
};

export default SalaryForm;
