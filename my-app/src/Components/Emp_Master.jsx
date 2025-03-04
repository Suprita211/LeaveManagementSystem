import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/employeemanager.css'; // Import the CSS file
const {API_URL_PROD} = process.env;
const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    EmpName: '',
    Designation: '',
    Department: '',            // New field for Department
    CompanyName: '',
    EmployeeEmailID: '',       // New field for Employee Email ID
    AadharNumber: '',         // New field for Aadhar Number
    PANNumber: '',
    ResidenceAddress: '',
    PrimaryContactNumber: '',
    SecondaryContactNumber: '',
    DateOfJoining: '',
    BirthDate: '',
    Gender: '',
    MarriedStatus: '',
    GuardianSpouseName: '',
    RetirementDate: '',
    UAN: '',              
    basic:'',
  });

  useEffect(() => {
    axios.get(`https://ems-be-v1.onrender.com/api/all`)
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'BirthDate') {
      calculateRetirementDate(value);
    }
  };

  const calculateRetirementDate = (birthDate) => {
    if (birthDate) {
      const birth = new Date(birthDate);
      const retirementYear = birth.getFullYear() + 60;
      const retirementDate = new Date(birth);
      retirementDate.setFullYear(retirementYear);

      const lastDayOfMonth = new Date(retirementDate.getFullYear(), retirementDate.getMonth() + 1, 0);
      setFormData((prevData) => ({
        ...prevData,
        RetirementDate: lastDayOfMonth.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`https://ems-be-v1.onrender.com/api/`, formData)
      .then(response => {
        setEmployees([...employees, response.data]);
        setFormData({
          EmpName: '',
          Designation: '',
          Department: '',            // New field for Department
          CompanyName : '',
          EmployeeEmailID: '',       // New field for Employee Email ID
          AadharNumber: '',         // New field for Aadhar Number
          PANNumber: '', 
          ResidenceAddress: '',
          PrimaryContactNumber: '',
          SecondaryContactNumber: '',
          DateOfJoining: '',
          BirthDate: '',
          Gender: '',
          MarriedStatus: '',
          GuardianSpouseName: '',
          RetirementDate: '',
          UAN: ''  ,         
          basic:'',
      });
    })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('Error: ' + error.message);
      });
  };

  return (
    <div className="container-fluid p-4">
      <h1 className="text-center mb-4">Employee Manager</h1>

      <div className="card p-4">
        <h2 className="text-center">Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Employee Name</label>
            <input type="text" className="form-control" name="EmpName" value={formData.EmpName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input type="text" className="form-control" name="CompanyName" value={formData.CompanyName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Designation</label>
            <input type="text" className="form-control" name="Designation" value={formData.Designation} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Residence Address</label>
            <input type="text" className="form-control" name="ResidenceAddress" value={formData.ResidenceAddress} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Primary Contact</label>
            <input type="text" className="form-control" name="PrimaryContactNumber" value={formData.PrimaryContactNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Secondary Contact</label>
            <input type="text" className="form-control" name="SecondaryContactNumber" value={formData.SecondaryContactNumber} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Date of Joining</label>
            <input type="date" className="form-control" name="DateOfJoining" value={formData.DateOfJoining} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Birth Date</label>
            <input type="date" className="form-control" name="BirthDate" value={formData.BirthDate} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Retirement Date</label>
            <input type="date" className="form-control" name="RetirementDate" value={formData.RetirementDate} readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-select" name="Gender" value={formData.Gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Marital Status</label>
            <select className="form-select" name="MarriedStatus" value={formData.MarriedStatus} onChange={handleChange} required>
              <option value="">Select Marital Status</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Guardian/Spouse Name</label>
            <input type="text" className="form-control" name="GuardianSpouseName" value={formData.GuardianSpouseName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input type="text" className="form-control" name="Department" value={formData.Department} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Employee Email ID</label>
            <input type="email" className="form-control" name="EmployeeEmailID" value={formData.EmployeeEmailID} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Aadhar Number</label>
            <input type="text" className="form-control" name="AadharNumber" value={formData.AadharNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">PAN Number</label>
            <input type="text" className="form-control" name="PANNumber" value={formData.PANNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">UAN Number</label>
            <input type="text" className="form-control" name="UAN" value={formData.UAN} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Basic pay</label>
            <input type="text" className="form-control" name="basic" value={formData.basic} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Employee</button>
        </form>
      </div>

      <h2 className="text-center my-4">Employee List</h2>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>EmpID</th>
            <th>Company Name</th>
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
            <th>Department</th>            {/* New column for Department */}
            <th>Employee Email ID</th>    {/* New column for Employee Email ID */}
            <th>Aadhar Number</th>        {/* New column for Aadhar Number */}
            <th>PAN Number</th>           {/* New column for PAN Number */}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.EmpID}</td>
              <td>{employee.CompanyName}</td>
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
              <td>{employee.Department}</td>       {/* New column for Department */}
              <td>{employee.EmployeeEmailID}</td>  {/* New column for Employee Email ID */}
              <td>{employee.AadharNumber}</td>     {/* New column for Aadhar Number */}
              <td>{employee.PANNumber}</td>        {/* New column for PAN Number */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManager;
