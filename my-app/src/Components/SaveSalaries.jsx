import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const {API_URL_PROD} = process.env;
// Months List
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SaveSalaries = () => {
  const [formData, setFormData] = useState({
    startId: "",
    endId: "",
    month: "",
    year: new Date().getFullYear().toString(),
  });

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:8080/api/employees/salaries/add-salary`, formData);
      console.log(response.data);

      // Success Toast (Green)
      toast.success(response.data.message, {
        position: "top-right",
        theme: "colored",
        autoClose: 3000,
      });

    } catch (error) {
      // Error Toast (Red)
      toast.error(error.response?.data?.message || "Server Error", {
        position: "top-right",
        theme: "colored",
        autoClose: 3000,
      });
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/employees/salaries/generate-salary`,
        formData
      );
  
      if (!response.data.pdfBase64) {
        toast.error("No PDF data received from the server!");
        return;
      }
  
      // Convert Base64 to a Blob
      const byteCharacters = atob(response.data.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
  
      // Create a download link and trigger it
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.setAttribute("download", "Salary_Slips.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success("Salary slips downloaded successfully!", {
        position: "top-right",
        theme: "colored",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to download salary slips!", {
        position: "top-right",
        theme: "colored",
        autoClose: 3000,
      });
    }
  
    setDownloading(false);
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ my: 2, textAlign: "center" }}>
        Save Employee Salaries
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Start Employee ID"
              name="startId"
              value={formData.startId}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="End Employee ID"
              name="endId"
              value={formData.endId}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label="Month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              fullWidth
              required
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 2 }}>
              {loading ? "Saving..." : "Save Salaries"}
            </Button>

            <Button variant="contained" color="secondary" onClick={handleDownload} disabled={downloading}>
              {downloading ? "Downloading..." : "Download"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SaveSalaries;
