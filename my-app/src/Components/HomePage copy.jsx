import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, Button, Grid, Paper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Add employee', path: '/emp-master' },
  { text: 'See All employees', path: '/emplist' },
  { text: 'Update Employee', path: '/view-employee' },
  { text: 'Salary Details', path: '/emp-salary' },
  { text: 'Apply For Leave', path: '/emp-leaveform' },
  { text: 'Leave Applications', path: '/leave-applications' },
  { text: 'Download Salary', path: '/save-salaries' },
  { text: 'See all Rejected leaves', path: '/EmpLeaveStatus' },
  { text: 'Add Absent', path: '/addabsent' },
  { text: 'Add Holiday', path: '/AddHoliday' },
  { text: 'Add bank Details', path: '/addbank' },
  { text: 'See bank Details', path: '/bankdetails' },


];

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // If you have some logout logic like clearing cookies/localStorage, you can add it here
    navigate('/signin'); // Redirect to login page on logout (optional)
    localStorage.clear(); // Clear all data from localStorage
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ marginTop : "-4rem"  ,width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}>
        <Toolbar />
        <List >
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ width: `calc(100% - 240px)`, ml: '240px' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Dashboard</Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Typography marginTop="30px" variant="h4">Welcome to the Dashboard</Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>Select a menu from the sidebar to view details.</Typography>

        {/* Content Layout with Grid */}
        <Grid container spacing={3}>
          {/* Left Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3 }}>
              <Typography variant="h6">Overview</Typography>
              <Typography variant="body1">Here you can find key statistics and quick access to your most important data.</Typography>
              {/* Add more details here (charts, tables, etc.) */}
            </Paper>
          </Grid>

          {/* Right Section - Additional Details */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3}>
              {/* User Profile Card */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">User Profile</Typography>
                    <Typography variant="body2">Name: Admin</Typography>
                    <Typography variant="body2">Role: Administrator</Typography>
                    <Typography variant="body2">Email: admin@pioneer.com</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activity Card */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Recent Activities</Typography>
                    <Typography variant="body2">• Updated Employee Details</Typography>
                    <Typography variant="body2">• Approved Leave Requests</Typography>
                    <Typography variant="body2">• Generated Salary Reports</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Quick Stats Card */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Quick Stats</Typography>
                    <Typography variant="body2">Employees: ♾</Typography>
                    <Typography variant="body2">Leave Requests: ✔ Pending</Typography>
                    <Typography variant="body2">Salary Reports: ✨ Generated</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
