import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const {API_URL_PROD} = process.env;
const EmployeeLeaveForm = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('CL');
  const [message, setMessage] = useState('');
  const [employeeExists, setEmployeeExists] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setEmployeeExists(true);

    try {
      const response = await axios.get(`https://ems-be-v1.onrender.com/api/leave/employee/${employeeId}`);
      if (!response.data.exists) {
        setMessage('Invalid Employee ID');
        setEmployeeExists(false);
        return;
      }

      // Submit leave application
      const leaveResponse = await axios.post(`https://ems-be-v1.onrender.com/api/leave/submit-leave`, {
        employeeId,
        leaveType,
      });
      setMessage(leaveResponse.data.message);
      setEmployeeExists(true);

      // Redirect to leave details form
      navigate('/leave-details', { state: { leaveType, employeeId } });

    } catch (error) {
      console.error('Error submitting leave application:', error);
      setMessage('Failed to submit leave application');
    }
  };

  return (
    <div className="container">
      <h2>Leave Application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Leave Type:</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="CL">Casual Leave (CL)</option>
            <option value="ML">Medical Leave (ML)</option>
            <option value="PL">Privilege Leave (PL)</option> {/* Changed SL to PL */}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmployeeLeaveForm;
