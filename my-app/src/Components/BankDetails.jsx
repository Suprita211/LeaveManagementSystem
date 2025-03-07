import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import axios from "axios";

const BankDetailsTable = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("EmpID");

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://ems-be-v1.onrender.com/api/bank/get/bank"
      );
      setBankDetails(response.data);
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...bankDetails].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    }
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5">Bank Details</Typography>
        <IconButton onClick={fetchBankDetails} color="primary">
          <Refresh />
        </IconButton>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={4}>
          <Table>
          <TableHead>
    <TableRow sx={{ backgroundColor: "#f5f5f5" }}> {/* Light Gray Background */}
        {[
            { id: "EmpID", label: "Emp ID" },
            { id: "EmpName", label: "Employee Name" },
            { id: "bankName", label: "Bank Name" },
            { id: "Acc_no", label: "Account Number" },
            { id: "IFSC_no", label: "IFSC Code" },
            { id: "paymentMode", label: "Payment Mode" }
        ].map((column) => (
            <TableCell key={column.id} sx={{ fontWeight: "bold", color: "#333" }}> {/* Dark Text */}
                <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSort(column.id)}
                >
                    {column.label}
                </TableSortLabel>
            </TableCell>
        ))}
    </TableRow>
</TableHead>

            <TableBody>
              {sortedData.map((bank) => (
                <TableRow key={bank.EmpID} hover>
                  <TableCell>{bank.EmpID}</TableCell>
                  <TableCell>{bank.EmpName}</TableCell>
                  <TableCell>{bank.bankName}</TableCell>
                  <TableCell>{bank.Acc_no}</TableCell>
                  <TableCell>{bank.IFSC_no}</TableCell>
                  <TableCell>{bank.paymentMode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default BankDetailsTable;
