import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
const {API_URL_PROD} = process.env;

const LeaveDetailsForm = () => {
  const location = useLocation();
  const { leaveType, employeeId } = location.state || {};


  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState(''); // New state for designation
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numOfDays, setNumOfDays] = useState(0);
  const [message, setMessage] = useState('');
  const [plTimesTaken, setPlTimesTaken] = useState(0);  // Updated for PL
  const [attachments, setAttachments] = useState([]);
  const [reason, setReason] = useState('');
  const [isAttachmentRequired, setIsAttachmentRequired] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    if (employeeId && leaveType) {
      fetchEmployeeDetails(employeeId, leaveType);
    }
  }, [employeeId, leaveType]);


  useEffect(() => {
    if (startDate && endDate) {
      fetchHolidaysAndCalculateDays();
    }
  }, [startDate, endDate]);


  useEffect(() => {
    if (leaveType === 'PL') {  // Updated to check for PL
      setIsAttachmentRequired(true); // PL always requires an attachment
    } else if (leaveType === 'ML' && numOfDays > 2) {
      setIsAttachmentRequired(true); // ML requires attachment if more than 2 days
    } else {
      setIsAttachmentRequired(false); // CL does not require an attachment
    }
  }, [numOfDays, leaveType]);


  const fetchEmployeeDetails = async (id, leaveType) => {
    try {
      const response = await axios.get(`https://ems-be-v1.onrender.com/api/leave1/employee/${id}/${leaveType}`);
      if (response.data.exists) {
        setEmployeeName(response.data.name);
        setDesignation(response.data.designation); // Set designation from the API
        setLeaveBalance(response.data.leaveBalance || 0);
        if (leaveType === 'PL') {  // Updated to PL
          setPlTimesTaken(response.data.plTimesTaken); // Fetch times taken for PL
        }
      } else {
        setMessage('Employee not found');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setMessage('Error fetching employee details');
    }
  };

  const fetchHolidaysAndCalculateDays = async () => {
    if (!startDate || !endDate) return;
  
    const start = new Date(startDate);
    const year = start.getFullYear();
    const month = start.toLocaleString("default", { month: "long" });
  
    try {
      const response = await axios.get(`https://ems-be-v1.onrender.com/api/leave1/holidays/${year}/${month}`);
      if (response.data.success) {
        const formattedHolidays = response.data.holidays.length > 0
          ? response.data.holidays.map(h => new Date(h.date).toDateString())
          : [];
  
        setHolidays(formattedHolidays); // Set holidays (empty if none)
      } else {
        setHolidays([]); // Ensure holidays array is cleared if no holidays exist
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setHolidays([]); // Ensure no blockage in case of an error
    }
  };
  
  // ✅ Ensure leave days are always calculated, even if no holidays exist
  useEffect(() => {
    if (startDate && endDate) {
      calculateLeaveDays(); 
    }
  }, [startDate, endDate, holidays]); // Runs when startDate, endDate, or holidays change
  
  const calculateHolidaysBetweenDates = (start, end) => {
    let holidayCount = 0;
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      if (holidays.includes(currentDate.toDateString())) {
        holidayCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return holidayCount;
  };
  
  const calculateLeaveDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log("from function");
    
  
    // if (start > end) {
    //   setMessage("Start date cannot be later than end date.");
    //   setNumOfDays(0);
    //   return;
    // }
  
    // ----new
    
    let totalDays = 0;
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      const isSunday = currentDate.getDay() === 0; // Sunday (0)
      
      // Exclude Sundays for PL & CL, but include them for ML
      if ((leaveType === "PL" || leaveType === "CL") && isSunday) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
  
      totalDays++;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    // Count holidays (if any)
    const holidayCount = calculateHolidaysBetweenDates(start, end);
  
    // Subtract holidays from total leave days
    const finalLeaveDays = totalDays - holidayCount;
  
    setNumOfDays(finalLeaveDays);
  };
  

  const handleAttachmentChange = (e) => {
    setAttachments(e.target.files);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!startDate || !endDate) {
      setMessage('Please select both start and end dates.');
      return;
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Ensure valid date comparison
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setMessage('Invalid date format. Please select a valid date.');
      return;
    }
  
    // if (start > end) {
    //   setMessage('Start date cannot be later than end date.');
    //   return;
    // }
    if (start > end) {
      alert('End Date cannot be lesser than the Start Date');
      return; // Prevent further execution
    }
  
    if (leaveType === 'CL' && numOfDays > 4) {
      setMessage('Number of days cannot be greater than 4.');
      return;
    }
  
    if ((leaveType === 'CL' || leaveType === 'ML') && numOfDays > leaveBalance) {
      setMessage('You are exceeding your leave balance.');
      return;
    }
  
    if (numOfDays <= 0) {
      setMessage('Please select valid dates.');
      return;
    }
  
    if (isAttachmentRequired && attachments.length === 0) {
      setMessage('Attachment is required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('employeeId', employeeId);
    formData.append('name', employeeName);
    formData.append('designation', designation);
    formData.append('leaveType', leaveType);
    formData.append('fromDate', startDate);
    formData.append('toDate', endDate);
    formData.append('numOfDays', numOfDays);
    formData.append('reason', reason);
  
    if (leaveType !== 'PL') {
      formData.append('leaveBalance', leaveBalance);
    }
  
    for (let file of attachments) {
      formData.append('attachments', file);
    }
  
    try {
      const response = await axios.post(`https://ems-be-v1.onrender.com/api/leave1/submit-leave`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        setMessage('Leave request submitted successfully');
        alert('Leave request submitted successfully. Admin will be notified.');
      } else {
        setMessage(response.data.message || 'Error submitting leave request');
      }
    } catch (error) {
      console.error('Error submitting leave:', error.response || error);
      setMessage('Error submitting leave');
    }
  };
  


  const handlePreview = () => {
    setShowPreview(true);
  };


  const handleClosePreview = () => {
    setShowPreview(false);
  };


  return (
    <div className="container">
      <h2>Leave Details</h2>
      {message && <p>{message}</p>}
      {!message && (
        <div>
          <h3>Employee Name: {employeeName}</h3>
          <p>Designation: {designation}</p> {/* Display Designation */}
          <p>Leave Type: {leaveType}</p>


          <form onSubmit={handleSubmit}>
          <div>
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  if (!startDate) {
                    alert("Please select a start date first.");
                    return;
                  }

                  const selectedEndDate = new Date(e.target.value);
                  const selectedStartDate = new Date(startDate);

                  // Check if the date is valid
                  if (isNaN(selectedEndDate) || isNaN(selectedStartDate)) {
                    alert("Invalid date selection.");
                    return;
                  }

                  // Check if the end date is earlier than the start date

                  // Ensure end date is in the same month and year as start date
                  if (
                    selectedEndDate.getMonth() !==
                      selectedStartDate.getMonth() ||
                    selectedEndDate.getFullYear() !==
                      selectedStartDate.getFullYear()
                  ) {
                    alert(
                      "Please select an end date within the same month as the start date."
                    );
                    setEndDate(""); // Reset end date
                    return;
                  }

                  setEndDate(e.target.value);
                }}
                required
              />
            </div> 

            <div>
              <label>Number of Days:</label>
              <input type="text" value={numOfDays} readOnly />
            </div>


            {leaveType === 'PL' && (  // Updated to PL
              <div>
                <label>Number of Times PL Taken:</label>
                <input type="text" value={plTimesTaken} readOnly />
              </div>
            )}


            {leaveType !== 'PL' && (
              <div>
                <label>Leave Balance:</label>
                <input type="text" value={leaveBalance} readOnly />
              </div>
            )}


            {isAttachmentRequired && (
              <div>
                <label>Attachment:</label>
                <input type="file" multiple onChange={handleAttachmentChange} required />
              </div>
            )}


            <div>
              <label>Reason for Leave:</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
            </div>


            <button type="button" className="btn btn-primary" onClick={handlePreview}>
              Preview
            </button>


            <button type="submit">Submit Leave</button>
          </form>
        </div>
      )}


      {showPreview && (
        <div className="modal show" style={{ display: 'block' }} id="previewModal" tabIndex="-1" aria-labelledby="previewModalLabel" aria-hidden="false">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="previewModalLabel">Leave Request Preview</h5>
                <button type="button" className="btn-close" onClick={handleClosePreview} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><strong>Employee ID:</strong> {employeeId}</p> {/* Display Employee ID */}
                <p><strong>Employee Name:</strong> {employeeName}</p>
                <p><strong>Designation:</strong> {designation}</p> {/* Display Designation in Preview */}
                <p><strong>Leave Type:</strong> {leaveType}</p>
                <p><strong>Start Date:</strong> {startDate}</p>
                <p><strong>End Date:</strong> {endDate}</p>
                <p><strong>Number of Days:</strong> {numOfDays}</p>
                {leaveType === 'PL' && <p><strong>PL Times Taken:</strong> {plTimesTaken}</p>}  {/* Updated for PL */}
                {leaveType !== 'PL' && <p><strong>Leave Balance:</strong> {leaveBalance}</p>}
                <p><strong>Reason:</strong> {reason}</p>
               
                {/* Display Attachment if present */}
                {isAttachmentRequired && attachments.length > 0 && (
                  <p><strong>Attachment:</strong>
                    {Array.from(attachments).map((file, index) => (
                      <span key={index}>{file.name}{index < attachments.length - 1 ? ', ' : ''}</span>
                    ))}
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClosePreview}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit Leave</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default LeaveDetailsForm;


