// src/pages/Payslip.js
import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import SearchBar from '../Components/SearchBar';
import SalaryForm from '../Components/SalaryForm';
const {API_URL_PROD} = process.env;
const Payslip = () => {
    const [empID, setEmpID] = useState(null);

    const handleSearch = (id) => {
        setEmpID(id);
    };

    const handleUpdate = () => {
        alert('Salary updated successfully');
    };

    const handleDelete = () => {
        setEmpID(null);
        // alert('Salary record deleted');
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 2 }}>Salary Management</Typography>
            <SearchBar onSearch={handleSearch} />
            {empID && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                    <SalaryForm
                        empID={empID}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                </Box>
            )}
        </Container>
    );
};

export default Payslip;
