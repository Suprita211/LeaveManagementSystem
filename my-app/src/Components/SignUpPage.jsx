import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const {API_URL_PROD} = process.env;

const SignUpPage = () => {
  const [EmployeeEmailID, setEmployeeEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://ems-be-v1.onrender.com/auth/register`,
        {
          EmployeeEmailID,
          password,
        }
      );

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/signin"), 2000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left side with Logo */}
      <Grid item xs={6} container justifyContent="center" alignItems="center">
        <img
          src="https://pgssw.co.in/assets/admin-source/images/logo.png"
          alt="Logo"
          style={{ width: "100%", maxWidth: 500 }}
        />
      </Grid>

      {/* Right side with Sign-Up Form */}
      <Grid item xs={6} container justifyContent="center" alignItems="center">
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Sign Up
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={EmployeeEmailID}
                onChange={(e) => setEmployeeEmailID(e.target.value)}
                margin="normal"
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
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
              />

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              {successMessage && (
                <Typography color="primary" variant="body2" sx={{ mt: 1 }}>
                  {successMessage}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Box>

            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Already have an account? <a href="/signin">Sign In</a>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
