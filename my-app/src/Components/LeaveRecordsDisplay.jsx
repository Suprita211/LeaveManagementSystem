import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import './css/employeeform.css';
const {API_URL_PROD} = process.env;
const LeaveRecords = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [error, setError] = useState('');

  // Fetch leave balances from the backend
  useEffect(() => {
    axios.get(`https://ems-be-v1.onrender.com/api/leave/leave-records`)
      .then(response => {
        setLeaveRecords(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave balances:', error);
        setError('Failed to fetch leave balances.');
      });
  }, []);

  return (
    <div className="container-fluid p-0">
      <Header />
      <div className="container my-5">
        <h2 className="text-center">Employee Leave Balances</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        {leaveRecords.length > 0 ? (
          <table className="table table-bordered mt-4">
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Medical Leave (ML)</th>
                <th>PL Times Taken</th>
                <th>PL Days Taken</th>
                <th>Casual Leave (CL)</th>
              </tr>
            </thead>
            <tbody>
              {leaveRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.EmpID}</td>
                  <td>{record.EmpName}</td>
                  <td>{record.ML}</td>
                  <td>{record.PL.timesTaken}</td>
                  <td>{record.PL.daysTaken}</td>
                  <td>{record.CL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No leave records found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LeaveRecords;
