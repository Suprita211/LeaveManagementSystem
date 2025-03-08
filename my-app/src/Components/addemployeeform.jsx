import React, { useState } from 'react';
import axios from 'axios';
const {API_URL_PROD} = process.env;
const API_URL = "https://ems-be-v1.onrender.com/api/abs";
const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    EmpName: '',
    Designation: '',
    ResidenceAddress: '',
    PrimaryContactNumber: '',
    SecondaryContactNumber: '',
    DateOfJoining: '',
    BirthDate: '',
    Gender: '',
    MarriedStatus: '',
    GuardianSpouseName: '',
    RetirementDate: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  
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

    axios.post(`https://ems-be-v1.onrender.com/api/employee`, formData)
      .then(response => {
        setSuccessMessage('Form submitted successfully!');
        
        // Clear the form after submission
        setFormData({
          EmpName: '',
          Designation: '',
          ResidenceAddress: '',
          PrimaryContactNumber: '',
          SecondaryContactNumber: '',
          DateOfJoining: '',
          BirthDate: '',
          Gender: '',
          MarriedStatus: '',
          GuardianSpouseName: '',
          RetirementDate: ''
        });
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        setSuccessMessage('Error: ' + error.message);
      });
  };

  return (
    <div className="card p-4">
      <h2 className="text-center">Add New Employee</h2>
      
      {/* Success message */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Employee Name</label>
            <input type="text" className="form-control" name="EmpName" value={formData.EmpName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Designation</label>
            <input type="text" className="form-control" name="Designation" value={formData.Designation} onChange={handleChange} required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Residence Address</label>
            <input type="text" className="form-control" name="ResidenceAddress" value={formData.ResidenceAddress} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Primary Contact</label>
            <input type="text" className="form-control" name="PrimaryContactNumber" value={formData.PrimaryContactNumber} onChange={handleChange} required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Secondary Contact</label>
            <input type="text" className="form-control" name="SecondaryContactNumber" value={formData.SecondaryContactNumber} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Date of Joining</label>
            <input type="date" className="form-control" name="DateOfJoining" value={formData.DateOfJoining} onChange={handleChange} required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Birth Date</label>
            <input type="date" className="form-control" name="BirthDate" value={formData.BirthDate} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Retirement Date</label>
            <input type="date" className="form-control" name="RetirementDate" value={formData.RetirementDate} readOnly />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select className="form-select" name="Gender" value={formData.Gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Marital Status</label>
            <select className="form-select" name="MarriedStatus" value={formData.MarriedStatus} onChange={handleChange} required>
              <option value="">Select Marital Status</option>
              <option value="Married">Married</option>
              <option value="UnMarried">UnMarried</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Guardian/Spouse Name</label>
          <input type="text" className="form-control" name="GuardianSpouseName" value={formData.GuardianSpouseName} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
