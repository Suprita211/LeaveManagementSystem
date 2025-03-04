import React, { useEffect, useState } from "react";
import axios from "axios";
const {API_URL_PROD} = process.env;
const ApprovedLeaveList = () => {
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      try {
        const response = await axios.get(`https://ems-be-v1.onrender.com/api/leave1/leavestatus`);

        if (response.data.message) {
          setError(response.data.message);
          setApprovedLeaves([]);
        } else {
          const formattedLeaves = response.data.map((leave) => ({
            empId: leave.employeeId,
            name: leave.name,
            designation: leave.designation,
            leaveType: leave.leaveType,
            numOfDays: leave.numOfDays,
            status: leave.approvalStatus,
            applicationMonth: new Date(leave.createdAt).toLocaleString("default", { month: "long", year: "numeric" }),
          }));
          setApprovedLeaves(formattedLeaves);
        }
      } catch (error) {
        console.error("Error fetching approved leaves:", error);
        setError("Failed to fetch data. Please check your connection.");
      }
    };

    fetchApprovedLeaves();
  }, []);

  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      <h2>Approved Leave Applications</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Leave Type</th>
            <th>Application Month</th>
            <th>Number of Days</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {approvedLeaves.length > 0 ? (
            approvedLeaves.map((leave, index) => (
              <tr key={index}>
                <td>{leave.empId}</td>
                <td>{leave.name}</td>
                <td>{leave.designation}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.applicationMonth}</td>
                <td>{leave.numOfDays}</td>
                <td>{leave.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No approved leave applications found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedLeaveList;
