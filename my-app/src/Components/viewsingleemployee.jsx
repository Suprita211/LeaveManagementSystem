import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewSingleEmployee = () => {
  const [empID, setEmpID] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState({});

  // Function to calculate retirement date based on the birth date or date of joining
  const calculateRetirementDate = (birthDate, dateOfJoining) => {
    const retirementAge = 60;
  
    const getLastDayOfMonth = (date) => {
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Get last day of the current month
      return lastDay;
    };
  
    const getFirstDayOfMonth = (date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1); // Get the first day of the current month
      return firstDay;
    };
  
    const isLeapYear = (year) => {
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    };
  
    const formatDate = (date) => {
      return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    };
  
    let retirementDate = null;
  
    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      birthDateObj.setFullYear(birthDateObj.getFullYear() + retirementAge);
      retirementDate = birthDateObj;
    } else if (dateOfJoining) {
      const joiningDateObj = new Date(dateOfJoining);
      joiningDateObj.setFullYear(joiningDateObj.getFullYear() + retirementAge);
      retirementDate = joiningDateObj;
    }
  
    if (retirementDate) {
      const dayOfMonth = retirementDate.getDate();
  
      // Check if the day is between the 2nd and the last day of the month
      if (dayOfMonth >= 2 && dayOfMonth <= getLastDayOfMonth(retirementDate).getDate()) {
        // Set the last day of the month as the retirement date
        retirementDate = getLastDayOfMonth(retirementDate);
      } else {
        // Otherwise, set the first day of the month as the retirement date
        retirementDate = getFirstDayOfMonth(retirementDate);
      }
  
      // Handle leap year: if the retirement date is in February, ensure the date is valid
      if (retirementDate.getMonth() === 1 && !isLeapYear(retirementDate.getFullYear())) {
        // If not a leap year, set the retirement date to the 28th of February
        retirementDate.setDate(28);
      }
    }
  
    return retirementDate ? formatDate(retirementDate) : null;
  };

  // Fetch Employee by EmpID
  const fetchEmployee = () => {
    const inputEmpID = empID.trim();

    if (!inputEmpID) {
      setError('Please enter a valid Employee ID.');
      setEmployee(null);
      return;
    }

    axios.get(`http://localhost:8080/api/employee/empID/${inputEmpID}`)
      .then((response) => {
        setEmployee(response.data);
        setUpdatedEmployee(response.data); // Populate the form with current data
        setError('');
      })
      .catch(() => {
        setEmployee(null);
        setError('Employee not found!');
      });
  };

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee(prevState => {
      const newData = {
        ...prevState,
        [name]: value,
      };

      // Automatically calculate and update the retirement date when BirthDate or DateOfJoining is updated
      if (name === 'BirthDate' || name === 'DateOfJoining') {
        const newRetirementDate = calculateRetirementDate(newData.BirthDate, newData.DateOfJoining);
        newData.RetirementDate = newRetirementDate;
      }

      // Handle PL updates
      if (name === 'PLtimesTaken' || name === 'PLdaysTaken') {
        newData.PL = {
          ...newData.PL,
          [name]: value,
        };
      }

      return newData;
    });
  };

  // Update Employee Details
  const updateEmployee = () => {
    if (!updatedEmployee.EmpID) {
      setError('Employee ID is missing.');
      return;
    }

    // Update Employee in the backend
    axios.put(`http://localhost:8080/api/employee/empID/${updatedEmployee.EmpID}`, updatedEmployee)
      .then((response) => {
        setEmployee(response.data);
        setUpdatedEmployee(response.data); // Sync state
        setError('Employee details updated successfully.');
        setIsEditable(false);
      })
      .catch(() => {
        setError('Error updating employee.');
      });
  };

  // Delete Employee
  const deleteEmployee = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      axios.delete(`http://localhost:8080/api/employee/empID/${employee.EmpID}`)
        .then(() => {
          setEmployee(null);
          setError('Employee deleted successfully.');
        })
        .catch(() => {
          setError('Error deleting employee.');
        });
    }
  };

  return (
    <div>
      <h1>Search Employee</h1>
      <div>
        <label>Enter Employee ID:</label>
        <input
          type="text"
          value={empID}
          onChange={(e) => setEmpID(e.target.value)}
          placeholder="Enter Employee ID"
        />
        <button onClick={fetchEmployee}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {employee && (
        <div>
          <h2>Employee Details</h2>
          {isEditable ? (
            <form>
              <label>ID: </label>
              <input type="text" value={updatedEmployee.EmpID} disabled />
              <br />

              <label>Name: </label>
              <input type="text" name="EmpName" value={updatedEmployee.EmpName} onChange={handleChange} />
              <br />

              <label>Designation: </label>
              <input type="text" name="Designation" value={updatedEmployee.Designation} onChange={handleChange} />
              <br />

              <label>Department: </label>
              <input type="text" name="Department" value={updatedEmployee.Department} onChange={handleChange} />
              <br />

              <label>Email: </label>
              <input type="email" name="EmployeeEmailID" value={updatedEmployee.EmployeeEmailID} onChange={handleChange} />
              <br />

              <label>Aadhar Number: </label>
              <input type="text" name="AadharNumber" value={updatedEmployee.AadharNumber} onChange={handleChange} />
              <br />

              <label>PAN Number: </label>
              <input type="text" name="PANNumber" value={updatedEmployee.PANNumber} onChange={handleChange} />
              <br />

              <label>Residence Address: </label>
              <input type="text" name="ResidenceAddress" value={updatedEmployee.ResidenceAddress} onChange={handleChange} />
              <br />

              <label>Primary Contact Number: </label>
              <input type="text" name="PrimaryContactNumber" value={updatedEmployee.PrimaryContactNumber} onChange={handleChange} />
              <br />

              <label>Secondary Contact Number: </label>
              <input type="text" name="SecondaryContactNumber" value={updatedEmployee.SecondaryContactNumber} onChange={handleChange} />
              <br />

              <label>Date of Joining: </label>
              <input
                type="date"
                name="DateOfJoining"
                value={updatedEmployee.DateOfJoining?.slice(0, 10)}
                onChange={handleChange}
              />
              <br />

              <label>Birth Date: </label>
              <input
                type="date"
                name="BirthDate"
                value={updatedEmployee.BirthDate?.slice(0, 10)}
                onChange={handleChange}
              />
              <br />

              <label>Retirement Date: </label>
              <input type="date" name="RetirementDate" value={updatedEmployee.RetirementDate?.slice(0, 10)} readOnly />
              <br />

              <label>PL (Privilege Leave Taken): </label>
              <input type="number" name="PLtimesTaken" value={updatedEmployee.PL?.timesTaken} onChange={handleChange} />
              <br />

              <label>PL (Privilege Leave Remaining): </label>
              <input type="number" name="PLdaysTaken" value={updatedEmployee.PL?.daysTaken} onChange={handleChange} />
              <br />

              <label>Gender: </label>
              <input type="text" name="Gender" value={updatedEmployee.Gender} onChange={handleChange} />
              <br />

              <label>Marital Status: </label>
              <input type="text" name="MarriedStatus" value={updatedEmployee.MarriedStatus} onChange={handleChange} />
              <br />

              <label>Guardian/Spouse Name: </label>
              <input type="text" name="GuardianSpouseName" value={updatedEmployee.GuardianSpouseName} onChange={handleChange} />
              <br />

              <button type="button" onClick={updateEmployee}>Update</button>
              <button type="button" onClick={() => setIsEditable(false)}>Cancel</button>
            </form>
          ) : (
            <div>
              <p><strong>ID:</strong> {employee.EmpID}</p>
              <p><strong>Name:</strong> {employee.EmpName}</p>
              <p><strong>Designation:</strong> {employee.Designation}</p>
              <p><strong>Department:</strong> {employee.Department}</p>
              <p><strong>Email:</strong> {employee.EmployeeEmailID}</p>
              <p><strong>Aadhar Number:</strong> {employee.AadharNumber}</p>
              <p><strong>PAN Number:</strong> {employee.PANNumber}</p>
              <p><strong>Residence Address:</strong> {employee.ResidenceAddress}</p>
              <p><strong>Primary Contact Number:</strong> {employee.PrimaryContactNumber}</p>
              <p><strong>Secondary Contact Number:</strong> {employee.SecondaryContactNumber}</p>
              <p><strong>Date of Joining:</strong> {employee.DateOfJoining}</p>
              <p><strong>Birth Date:</strong> {employee.BirthDate}</p>
              <p><strong>Retirement Date:</strong> {employee.RetirementDate}</p>
              <p><strong>PL (Privilege Leave Taken):</strong> {employee.PL?.timesTaken}</p>
              <p><strong>PL (Privilege Leave Remaining):</strong> {employee.PL?.daysTaken}</p>
              <p><strong>Gender:</strong> {employee.Gender}</p>
              <p><strong>Marital Status:</strong> {employee.MarriedStatus}</p>
              <p><strong>Guardian/Spouse Name:</strong> {employee.GuardianSpouseName}</p>
              <button onClick={() => setIsEditable(true)}>Edit</button>
              <button onClick={deleteEmployee}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewSingleEmployee;
