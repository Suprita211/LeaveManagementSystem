import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// require('dotenv').config();
const API_URL = process.env.API_URL_PROD;

const SignInPage = () => {
  const [EmployeeEmailID, setEmployeeEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`https://ems-be-v1.onrender.com/auth/login`, {
        EmployeeEmailID,
        password
      });
      console.log("User Data from API:", response.data.user);

      if (response.data.token) {
        // Store the token in localStorage or context
        localStorage.setItem('authToken', response.data.token);
        
        // Store user data if needed
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Redirect to dashboard or home page
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container style={{ height: '100vh' }}>
      {/* Left side with the Logo */}
      <Grid item xs={6} container justifyContent="center" alignItems="center">
        <img
          src="https://pgssw.co.in/assets/admin-source/images/logo.png"
          alt="Logo"
          style={{ width: '100%', maxWidth: 500 }}
        />
      </Grid>
      
      {/* Right side with Sign-In Form */}
      <Grid item xs={6} container justifyContent="center" alignItems="center">
        <Container component="main" maxWidth="xs">
          <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>Employee Sign In</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={EmployeeEmailID}
                onChange={(e) => setEmployeeEmailID(e.target.value)}
                margin="normal"
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Default user type: <strong>user</strong>
                </Typography>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
