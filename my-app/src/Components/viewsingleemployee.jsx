import React, { useState, useEffect } from "react";
import axios from "axios";
const {API_URL_PROD} = process.env;

const EmployeeDetails = () => {
  const [empID, setEmpID] = useState("");
  const [employee, setEmployee] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState({});
  const [error, setError] = useState("");

  // Fetch Employee Details
  const fetchEmployee = async () => {
    if (!empID.trim()) {
      setError("Please enter an Employee ID.");
      return;
    }

    try {
      const response = await axios.get(`https://ems-be-v1.onrender.com/api/singleemployee/empID/${empID}`);
      setEmployee(response.data);
      setUpdatedEmployee(response.data);
      setError("");
    } catch (err) {
      setError("Employee not found!");
      setEmployee(null);
    }
  };

  // Handle Input Change for Editable Fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...updatedEmployee, [name]: value };
    setUpdatedEmployee(updatedData);
  };

  // Recalculate the Retirement Date based on DateOfJoining or BirthDate
  const calculateRetirementDate = (data) => {
    let newRetirementDate = null;

    // Calculate Retirement Date based on BirthDate
    if (data.BirthDate) {
      const birthDate = new Date(data.BirthDate);
      if (!isNaN(birthDate.getTime())) {
        newRetirementDate = new Date(birthDate);
        newRetirementDate.setFullYear(newRetirementDate.getFullYear() + 60); // Retirement at 60
      }
    }

    // Calculate Retirement Date based on DateOfJoining
    if (data.DateOfJoining) {
      const doj = new Date(data.DateOfJoining);
      if (!isNaN(doj.getTime())) {
        const dojRetirement = new Date(doj);
        dojRetirement.setFullYear(dojRetirement.getFullYear() + 40); // Retirement at 40 years of service

        // Prioritize the latest retirement date
        if (!newRetirementDate || dojRetirement > newRetirementDate) {
          newRetirementDate = dojRetirement;
        }
      }
    }

    // Ensure retirement date is set to the LAST day of the month
    if (newRetirementDate) {
      newRetirementDate = new Date(newRetirementDate.getFullYear(), newRetirementDate.getMonth() + 1, 0);
      setUpdatedEmployee((prevState) => ({ ...prevState, RetirementDate: newRetirementDate }));
    }
  };

  // Update Employee Details
  const updateEmployee = async () => {
    try {
      const response = await axios.put(
        `https://ems-be-v1.onrender.com/api/empID/${empID}`,
        updatedEmployee
      );
      setEmployee(response.data); // Updated response with new RetirementDate
      setUpdatedEmployee(response.data);
      setIsEditable(false);
      setError("Employee details updated successfully.");
    } catch {
      setError("Error updating employee.");
    }
  };

  // Delete Employee
  const deleteEmployee = async () => {
    try {
      await axios.delete(`https://ems-be-v1.onrender.com/api/employee/empID/${empID}`);
      setEmployee(null);
      setError("Employee deleted successfully.");
    } catch {
      setError("Error deleting employee.");
    }
  };

  // useEffect to recalculate retirement date when DateOfJoining or BirthDate changes
  useEffect(() => {
    if (updatedEmployee.BirthDate || updatedEmployee.DateOfJoining) {
      calculateRetirementDate(updatedEmployee);
    }
  }, [updatedEmployee.BirthDate, updatedEmployee.DateOfJoining]);

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2>Employee Details</h2>

      {/* Employee ID Input */}
      <input
        type="text"
        placeholder="Enter Employee ID"
        value={empID}
        onChange={(e) => setEmpID(e.target.value)}
        style={{ padding: "8px", width: "70%", marginBottom: "10px" }}
      />
      <button onClick={fetchEmployee} style={{ marginLeft: "10px", padding: "8px 15px" }}>
        Submit
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Employee Details */}
      {employee && (
        <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
          <h3>Employee Information</h3>

          <p><strong>EmpID:</strong> {employee.EmpID}</p>

          <p>
            <strong>Name:</strong>{" "}
            {isEditable ? (
              <input type="text" name="EmpName" value={updatedEmployee.EmpName} onChange={handleInputChange} />
            ) : (
              employee.EmpName
            )}
          </p>

          <p>
            <strong>Designation:</strong>{" "}
            {isEditable ? (
              <input type="text" name="Designation" value={updatedEmployee.Designation} onChange={handleInputChange} />
            ) : (
              employee.Designation
            )}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {isEditable ? (
              <input type="text" name="Department" value={updatedEmployee.Department} onChange={handleInputChange} />
            ) : (
              employee.Department
            )}
          </p>

          <p>
            <strong>Company Name:</strong>{" "}
            {isEditable ? (
              <input type="text" name="CompanyName" value={updatedEmployee.CompanyName} onChange={handleInputChange} />
            ) : (
              employee.CompanyName
            )}
          </p>

          <p>
            <strong>Employee Email:</strong>{" "}
            {isEditable ? (
              <input type="email" name="EmployeeEmailID" value={updatedEmployee.EmployeeEmailID} onChange={handleInputChange} />
            ) : (
              employee.EmployeeEmailID
            )}
          </p>

          <p>
            <strong>Aadhar Number:</strong> {employee.AadharNumber}
          </p>

          <p>
            <strong>PAN Number:</strong> {employee.PANNumber}
          </p>

          <p>
            <strong>Residence Address:</strong>{" "}
            {isEditable ? (
              <input type="text" name="ResidenceAddress" value={updatedEmployee.ResidenceAddress} onChange={handleInputChange} />
            ) : (
              employee.ResidenceAddress
            )}
          </p>

          <p>
            <strong>Primary Contact Number:</strong>{" "}
            {isEditable ? (
              <input type="text" name="PrimaryContactNumber" value={updatedEmployee.PrimaryContactNumber} onChange={handleInputChange} />
            ) : (
              employee.PrimaryContactNumber
            )}
          </p>

          <p>
            <strong>Date of Joining:</strong>{" "}
            {isEditable ? (
              <input
                type="date"
                name="DateOfJoining"
                value={updatedEmployee.DateOfJoining ? updatedEmployee.DateOfJoining.split("T")[0] : ""}
                onChange={handleInputChange}
              />
            ) : (
              employee.DateOfJoining && new Date(employee.DateOfJoining).toLocaleDateString()
            )}
          </p>

          <p>
            <strong>Birth Date:</strong>{" "}
            {isEditable ? (
              <input
                type="date"
                name="BirthDate"
                value={updatedEmployee.BirthDate ? updatedEmployee.BirthDate.split("T")[0] : ""}
                onChange={handleInputChange}
              />
            ) : (
              employee.BirthDate && new Date(employee.BirthDate).toLocaleDateString()
            )}
          </p>

          <p>
            <strong>Retirement Date:</strong>{" "}
            {isEditable ? (
              <input
                type="date"
                name="RetirementDate"
                value={updatedEmployee.RetirementDate ? new Date(updatedEmployee.RetirementDate).toISOString().split("T")[0] : ""}
                onChange={handleInputChange}
              />
            ) : (
              updatedEmployee.RetirementDate ? new Date(updatedEmployee.RetirementDate).toLocaleDateString() : ""
            )}
          </p>

          {/* Edit and Delete Buttons */}
          {isEditable ? (
            <>
              <button onClick={updateEmployee} style={{ padding: "8px 15px", marginRight: "10px" }}>
                Save
              </button>
              <button onClick={() => setIsEditable(false)} style={{ padding: "8px 15px" }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditable(true)} style={{ padding: "8px 15px", marginRight: "10px" }}>
              Edit
            </button>
          )}

          <button onClick={deleteEmployee} style={{ padding: "8px 15px", backgroundColor: "red", color: "white" }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
