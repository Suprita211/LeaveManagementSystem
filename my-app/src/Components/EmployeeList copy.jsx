import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  TablePagination, Box, Grid, Divider
} from '@mui/material';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch employee data from the backend
    axios
      .get('http://localhost:8080/api/')
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ margin: '20px' }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Employee List
      </Typography>
      
      <TableContainer component={Paper} sx={{ maxHeight: '60vh', borderRadius: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>EmpID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>EmpName</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Designation</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Residence Address</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Primary Contact</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Secondary Contact</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>DOJ</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Retirement</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Gender</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Married</TableCell>
              {/* <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Guardian Name</TableCell> */}
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>Guardian/Spouse Name</TableCell> {/* Added GuardianSpouseName column */}
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>SL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>PL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>CL</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2e3b55' }}>EOL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow hover key={employee._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell align="center">{employee.EmpID || '-'}</TableCell>
                  <TableCell align="center">{employee.EmpName || '-'}</TableCell>
                  <TableCell align="center">{employee.Designation || '-'}</TableCell>
                  <TableCell align="center">{employee.ResidenceAddress || '-'}</TableCell>
                  <TableCell align="center">{employee.PrimaryContactNumber || '-'}</TableCell>
                  <TableCell align="center">{employee.SecondaryContactNumber || '-'}</TableCell>
                  <TableCell align="center">{new Date(employee.DateOfJoining).toLocaleDateString() || '-'}</TableCell>
                  <TableCell align="center">{employee.RetirementDate ? new Date(employee.RetirementDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell align="center">{employee.Gender || '-'}</TableCell>
                  <TableCell align="center">{employee.MarriedStatus || '-'}</TableCell>
                  {/* <TableCell align="center">{employee.GuardianName || '-'}</TableCell> */}
                  <TableCell align="center">{employee.GuardianSpouseName || '-'}</TableCell> {/* Displayed GuardianSpouseName */}
                  <TableCell align="center">{employee.SL || '-'}</TableCell>
                  <TableCell align="center">{employee.PL || '-'}</TableCell>
                  <TableCell align="center">{employee.CL || '-'}</TableCell>
                  <TableCell align="center">{employee.EOL || '-'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: '#f4f6f8', borderRadius: 2 }}
        />
      </Box>
    </div>
  );
};

export default EmployeeList;
