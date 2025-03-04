import React, { useEffect, useState } from 'react';
import axios from 'axios';
const {API_URL_PROD} = process.env;
const EmployeeView = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get(`https://ems-be-v1.onrender.com/api/all`) // Adjust API URL if needed
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Employee Details</h2>
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>EmpID</th>
            <th>EmpName</th>
            <th>Designation</th>
            <th>Residence Address</th>
            <th>Primary Contact</th>
            <th>Secondary Contact</th>
            <th>Date of Joining</th>
            <th>Retirement Date</th>
            <th>Gender</th>
            <th>Marital Status</th>
            <th>Guardian/Spouse Name</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.EmpID}>
              <td>{employee.EmpID}</td>
              <td>{employee.EmpName}</td>
              <td>{employee.Designation}</td>
              <td>{employee.ResidenceAddress}</td>
              <td>{employee.PrimaryContactNumber}</td>
              <td>{employee.SecondaryContactNumber}</td>
              <td>{new Date(employee.DateOfJoining).toLocaleDateString()}</td>
              <td>{employee.RetirementDate ? new Date(employee.RetirementDate).toLocaleDateString() : 'N/A'}</td>
              <td>{employee.Gender}</td>
              <td>{employee.MarriedStatus}</td>
              <td>{employee.GuardianSpouseName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeView;
