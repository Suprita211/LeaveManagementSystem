import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/employeemanager.css'; // Import the CSS file
const {API_URL_PROD} = process.env;

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee details
  const [formVisible, setFormVisible] = useState(false); // Toggle form visibility
  const [error, setError] = useState(''); // Store any error messages
  const [loading, setLoading] = useState(false); // Loading state for fetching employees

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    axios.get(`https://ems-be-v1.onrender.com/api/all`)
      .then(response => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching employees.');
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedEmployee(prevState => {
      let updatedEmployee = { ...prevState, [name]: value };

      // Handle Retirement Date calculation based on Birth Date or Date of Joining
      if (name === "BirthDate") {
        const birthDate = new Date(value);
        if (!isNaN(birthDate.getTime())) {
          const retirementFromBirth = new Date(birthDate);
          retirementFromBirth.setFullYear(retirementFromBirth.getFullYear() + 60);

          let retirementDate = new Date(retirementFromBirth);

          // Check if retirement date should be the last day of the month or first
          const lastDayOfMonth = new Date(retirementDate.getFullYear(), retirementDate.getMonth() + 1, 0);
          const firstDayOfMonth = new Date(retirementDate.getFullYear(), retirementDate.getMonth(), 1);

          if (retirementDate.getDate() >= 2 && retirementDate.getDate() <= lastDayOfMonth.getDate()) {
            // Between second and last day of the month, set to last day of the month
            updatedEmployee.RetirementDate = lastDayOfMonth.toISOString().split('T')[0];
          } else {
            // Otherwise, set to first day of the month
            updatedEmployee.RetirementDate = firstDayOfMonth.toISOString().split('T')[0];
          }
        }
      }

      if (name === "DateOfJoining") {
        const doj = new Date(value);
        if (!isNaN(doj.getTime())) {
          const retirementFromDOJ = new Date(doj);
          retirementFromDOJ.setFullYear(retirementFromDOJ.getFullYear() + 40);

          let retirementDate = new Date(retirementFromDOJ);

          // Check if retirement date should be the last day of the month or first
          const lastDayOfMonth = new Date(retirementDate.getFullYear(), retirementDate.getMonth() + 1, 0);
          const firstDayOfMonth = new Date(retirementDate.getFullYear(), retirementDate.getMonth(), 1);

          if (retirementDate.getDate() >= 2 && retirementDate.getDate() <= lastDayOfMonth.getDate()) {
            // Between second and last day of the month, set to last day of the month
            updatedEmployee.RetirementDate = lastDayOfMonth.toISOString().split('T')[0];
          } else {
            // Otherwise, set to first day of the month
            updatedEmployee.RetirementDate = firstDayOfMonth.toISOString().split('T')[0];
          }
        }
      }

      return updatedEmployee;
    });
  };

  const handleUpdate = (empID) => {
    setLoading(true);
    axios.get(`https://ems-be-v1.onrender.com/api/singleemployee/empID/${empID}`)
      .then(response => {
        setSelectedEmployee(response.data);
        setFormVisible(true);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching employee details.');
        setLoading(false);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!selectedEmployee) return;

    setLoading(true);
    axios.put(`https://ems-be-v1.onrender.com/api/empID/${selectedEmployee.EmpID}`, selectedEmployee)
      .then(() => {
        alert('Employee updated successfully');
        fetchEmployees();
        setFormVisible(false);
        setSelectedEmployee(null);
        setLoading(false);
      })
      .catch(error => {
        setError('Error updating employee.');
        setLoading(false);
      });
  };

  const handleDelete = (empID) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      axios.delete(`https://ems-be-v1.onrender.com/api/employee/empID/${empID}`)
        .then(() => {
          alert('Employee deleted successfully');
          fetchEmployees();
          setLoading(false);
        })
        .catch(error => {
          setError('Error deleting employee.');
          setLoading(false);
        });
    }
  };

  return (
    <div className="container-fluid p-4">
      <h1 className="text-center mb-4">Employee Manager</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      {formVisible && selectedEmployee && (
        <div className="card p-4">
          <h2 className="text-center">Update Employee</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Employee ID</label>
              <input type="text" className="form-control" name="EmpID" value={selectedEmployee.EmpID} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-control" name="CompanyName" value={selectedEmployee.CompanyName} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Employee Name</label>
              <input type="text" className="form-control" name="EmpName" value={selectedEmployee.EmpName} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Designation</label>
              <input type="text" className="form-control" name="Designation" value={selectedEmployee.Designation} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Residence Address</label>
              <input type="text" className="form-control" name="ResidenceAddress" value={selectedEmployee.ResidenceAddress} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Primary Contact</label>
              <input type="text" className="form-control" name="PrimaryContactNumber" value={selectedEmployee.PrimaryContactNumber} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Joining</label>
              <input type="date" className="form-control" name="DateOfJoining" value={selectedEmployee.DateOfJoining.split('T')[0]} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Date Of Birth</label>
              <input type="date" className="form-control" name="BirthDate" value={selectedEmployee.BirthDate.split('T')[0]} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Retirement Date</label>
              <input type="date" className="form-control" name="RetirementDate" value={selectedEmployee.RetirementDate.split('T')[0]} readOnly />
            </div>

            {/* New Fields */}
            <div className="mb-3">
              <label className="form-label">Department</label>
              <input type="text" className="form-control" name="Department" value={selectedEmployee.Department} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Employee Email ID</label>
              <input type="email" className="form-control" name="EmployeeEmailID" value={selectedEmployee.EmployeeEmailID} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Aadhar Number</label>
              <input type="text" className="form-control" name="AadharNumber" value={selectedEmployee.AadharNumber} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">PAN Number</label>
              <input type="text" className="form-control" name="PANNumber" value={selectedEmployee.PANNumber} onChange={handleInputChange} />
            </div>

            {/* Leave Fields - Set as ReadOnly */}
            <div className="mb-3">
              <label className="form-label">ML (Medical Leave)</label>
              <input type="number" className="form-control" name="ML" value={selectedEmployee.ML} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">PL (Privilege Leave) - Times Taken</label>
              <input type="number" className="form-control" name="PL_timesTaken" value={selectedEmployee.PL?.timesTaken || ''} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">PL (Privilege Leave) - Days Taken</label>
              <input type="number" className="form-control" name="PL_daysTaken" value={selectedEmployee.PL?.daysTaken || ''} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">CL (Casual Leave)</label>
              <input type="number" className="form-control" name="CL" value={selectedEmployee.CL} readOnly />
            </div>

            <button type="submit" className="btn btn-primary w-100">Update Employee</button>
          </form>
        </div>
      )}

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
            <th>ML</th>
            <th>PL Times Taken</th>
            <th>PL Days Taken</th>
            <th>CL</th>
            <th>Department</th>
            <th>Employee Email ID</th>
            <th>Aadhar Number</th>
            <th>PAN Number</th>
            <th>Actions</th>
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
              <td>{employee.ML}</td>
              <td>{employee.PL?.timesTaken}</td>
              <td>{employee.PL?.daysTaken}</td>
              <td>{employee.CL}</td>
              <td>{employee.Department}</td>
              <td>{employee.EmployeeEmailID}</td>
              <td>{employee.AadharNumber}</td>
              <td>{employee.PANNumber}</td>
              <td>
                <button className="btn btn-warning mx-1" onClick={() => handleUpdate(employee.EmpID)}>Update</button>
                <button className="btn btn-danger" onClick={() => handleDelete(employee.EmpID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManager;
