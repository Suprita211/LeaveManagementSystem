// src/components/SearchBar.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const SearchBar = ({ onSearch }) => {
    const [empID, setEmpID] = useState('');

    const handleSearch = () => {
        if (empID.trim()) {
            onSearch(empID);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <TextField
                label="Enter EmpID"
                variant="outlined"
                value={empID}
                onChange={(e) => setEmpID(e.target.value)}
                sx={{ mr: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
            </Button>
        </Box>
    );
};

export default SearchBar;
