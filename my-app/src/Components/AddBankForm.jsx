import { useState } from "react";
import { TextField, Button, Container, Typography, MenuItem } from "@mui/material";
import axios from "axios";

const BankDetailsForm = () => {
    const [formData, setFormData] = useState({
        EmpID: "",
        EmpName: "",
        bankName: "",
        Acc_no: "",
        IFSC_no: "",
        paymentMode: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/bank/addbank", formData);
            alert("Bank details added successfully!");
            setFormData({ EmpID: "", EmpName: "", bankName: "", Acc_no: "", IFSC_no: "", paymentMode: "" });
        } catch (error) {
            alert("Error adding bank details: " + error.response?.data?.error || error.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                Add Bank Details
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth margin="normal" label="Employee ID" name="EmpID" value={formData.EmpID} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Employee Name" name="EmpName" value={formData.EmpName} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="Account Number" name="Acc_no" value={formData.Acc_no} onChange={handleChange} required />
                <TextField fullWidth margin="normal" label="IFSC Code" name="IFSC_no" value={formData.IFSC_no} onChange={handleChange} required />
                <TextField select fullWidth margin="normal" label="Payment Mode" name="paymentMode" value={formData.paymentMode} onChange={handleChange} required>
                    <MenuItem value="NEFT">NEFT</MenuItem>
                    <MenuItem value="RTGS">RTGS</MenuItem>
                    <MenuItem value="IMPS">IMPS</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default BankDetailsForm;
