import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const {API_URL_PROD} = process.env;

const API_URL = "${API_URL_PROD}/api/abs";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth(); // 0-based index (0 = Jan, 11 = Dec)
const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1; // Handle Jan case
const defaultMonth = `${months[lastMonthIndex]} ${currentYear}`;

const AbsentList = () => {
  const [absents, setAbsents] = useState([]);
  const [formData, setFormData] = useState({
    EmpID: "",
    EmpName: "",
    DaysAbsent: "",
    Month: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAbsents();
    setFormData((prev) => ({ ...prev, Month: defaultMonth }));
  }, []);

  const fetchAbsents = async () => {
    try {
      const res = await axios.get(`https://ems-be-v1.onrender.com/api/abs/get/all`);
      setAbsents(res.data);
    } catch (error) {
      toast.error("Error fetching absences");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://ems-be-v1.onrender.com/api/abs/absent/`, formData);
        toast.success("Absent record updated!");
      } else {
        await axios.post(`https://ems-be-v1.onrender.com/api/abs/add`, formData);
        toast.success("Absent record added!");
      }
      setFormData({ EmpID: "", EmpName: "", DaysAbsent: "", Month: "" });
      setEditingId(null);
      fetchAbsents();
    } catch (error) {
      toast.error("Error saving data");
    }
  };

  const handleEdit = (absent) => {
    setFormData(absent);
    setEditingId(absent.EmpID);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ems-be-v1.onrender.com/api/abs/absent/${id}`);
      toast.success("Record deleted!");
      fetchAbsents();
    } catch (error) {
      toast.error("Error deleting data");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Absent Record
      </Typography>

      {/* Form */}
      <Paper sx={{ p: 1, mb: 1 , textAlign: "center" }}>
        <Typography variant="h6">
          {editingId ? "Edit" : "Add"} Absent days
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Emp ID"
            name="EmpID"
            value={formData.EmpID}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Emp Name"
            name="EmpName"
            value={formData.EmpName}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Days Absent"
            type="number"
            name="DaysAbsent"
            value={formData.DaysAbsent}
            onChange={handleChange}
            required
            margin="normal"
          />
          <InputLabel>Month</InputLabel>
          <Select
            name="Month"
            value={formData.Month}
            onChange={handleChange}
            required
            sx={{ minWidth: 200 }} // Prevent squeezing
          >
            {months.map((month) => (
              <MenuItem key={month} value={`${month} ${currentYear}`}>
                {month} {currentYear}
              </MenuItem>
            ))}
          </Select>{" "}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {editingId ? "Update" : "Add"} Absent
          </Button>
        </form>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Emp ID</strong>
              </TableCell>
              <TableCell>
                <strong>Emp Name</strong>
              </TableCell>
              <TableCell>
                <strong>Days Absent</strong>
              </TableCell>
              <TableCell>
                <strong>Month</strong>
              </TableCell>
              {/* <TableCell><strong>Actions</strong></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {absents.map((absent) => (
              <TableRow key={absent.EmpID}>
                <TableCell>{absent.EmpID}</TableCell>
                <TableCell>{absent.EmpName}</TableCell>
                <TableCell>{absent.DaysAbsent}</TableCell>
                <TableCell>{absent.Month}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AbsentList;