import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedRequest, setUpdatedRequest] = useState({});

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/leave1/admin/leave-requests');
      setLeaveRequests(response.data);
    } catch (error) {
      setMessage('Error fetching leave requests');
      console.error('Error fetching leave requests:', error);
    }
  };

  // Handle approval or rejection of leave request
  const handleApproval = async (id, status) => {
    if (!updatedRequest.reportingHeadSignature || !updatedRequest.reportingHeadReason ||
        !updatedRequest.sanctioningAuthoritySignature || !updatedRequest.sanctioningAuthorityReason) {
      setMessage('Please fill in all signature and reason fields');
      return;
    }
    try {
      // Send additional fields when approving or rejecting
      await axios.post(`http://localhost:8080/api/leave1/admin/approve-reject/${id}`, {
        status,
        reportingHeadSignature: updatedRequest.reportingHeadSignature,
        reportingHeadReason: updatedRequest.reportingHeadReason,
        sanctioningAuthoritySignature: updatedRequest.sanctioningAuthoritySignature,
        sanctioningAuthorityReason: updatedRequest.sanctioningAuthorityReason
      });

      setLeaveRequests(leaveRequests.map((request) =>
        request._id === id ? { ...request, approvalStatus: status } : request
      ));
    } catch (error) {
      setMessage('Error updating leave request');
      console.error('Error updating leave request:', error);
    }
  };

  // Function to calculate the number of days between two dates
  const calculateNumOfDays = (fromDate, toDate) => {
    const diffTime = new Date(toDate) - new Date(fromDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;  // Add 1 to include the start date
  };

  // Handling the date changes and recalculating the number of days
  const handleDateChange = (e, dateType) => {
    const newDate = e.target.value;
    setUpdatedRequest((prev) => {
      const updated = { ...prev, [dateType]: newDate };
      if (updated.fromDate && updated.toDate) {
        updated.numOfDays = calculateNumOfDays(updated.fromDate, updated.toDate);
      }
      return updated;
    });
  };

  // Handle the update operation
  const handleUpdate = async () => {
    setMessage(''); // Clear previous message before the update attempt
    try {
      // Send the updated leave request fields
      await axios.post(`http://localhost:8080/api/leave1/admin/update-leave/${selectedRequest._id}`, updatedRequest);

      setLeaveRequests(leaveRequests.map((request) =>
        request._id === selectedRequest._id ? { ...request, ...updatedRequest } : request
      ));

      setShowModal(false);
      setMessage('Leave request updated successfully');
    } catch (error) {
      setMessage('Error updating leave request');
      console.error('Error updating leave request:', error);
    }
  };

  // Open the modal and populate the selected request's data
  const openModal = (request) => {
    setSelectedRequest(request);
    setUpdatedRequest({
      ...request,
      fromDate: new Date(request.fromDate).toISOString().split('T')[0],
      toDate: new Date(request.toDate).toISOString().split('T')[0],
      numOfDays: calculateNumOfDays(request.fromDate, request.toDate),  // Add this line for initial numOfDays calculation
      designation: request.designation || '', // Default designation if exists
      reportingHeadSignature: request.reportingHeadSignature || '',
      reportingHeadReason: request.reportingHeadReason || '',
      sanctioningAuthoritySignature: request.sanctioningAuthoritySignature || '',
      sanctioningAuthorityReason: request.sanctioningAuthorityReason || ''
    });
    setShowModal(true); // This should show the modal
  };

  // Close the modal and reset states
  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setUpdatedRequest({});
  };

  return (
    <div className="container">
      <h3>Pending Leave Requests</h3>
      {message && <p>{message}</p>}
      {leaveRequests.length === 0 ? (
        <p>No pending leave requests</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Number of Days</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.name}</td>
                <td>{request.leaveType === 'SL' ? 'PL' : request.leaveType}</td> {/* Change SL to PL */}
                <td>{new Date(request.fromDate).toLocaleDateString()}</td>
                <td>{new Date(request.toDate).toLocaleDateString()}</td>
                <td>{request.numOfDays}</td>
                <td>{request.approvalStatus}</td>
                <td>
                  <button onClick={() => openModal(request)}>View/Update</button>
                  <button onClick={() => handleApproval(request._id, 'Approved')}>Approve</button>
                  <button onClick={() => handleApproval(request._id, 'Rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for updating leave request */}
      {showModal && selectedRequest && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Leave Request</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Employee ID:</strong> {updatedRequest.employeeId}</p>
                <p><strong>Employee Name:</strong> {selectedRequest.name}</p>
                <p><strong>Leave Type:</strong> {selectedRequest.leaveType}</p>
                <p><strong>From Date:</strong>
                  <input
                    type="date"
                    value={updatedRequest.fromDate}
                    onChange={(e) => handleDateChange(e, 'fromDate')}
                  />
                </p>
                <p><strong>To Date:</strong>
                  <input
                    type="date"
                    value={updatedRequest.toDate}
                    onChange={(e) => handleDateChange(e, 'toDate')}
                  />
                </p>
                <p><strong>Number of Days:</strong>
                  <input
                    type="number"
                    value={updatedRequest.numOfDays}
                    readOnly
                  />
                </p>
                <p><strong>Reason:</strong>
                  <textarea
                    value={updatedRequest.reason}
                    onChange={(e) => setUpdatedRequest({ ...updatedRequest, reason: e.target.value })}>
                  </textarea>
                </p>
                <p><strong>Designation:</strong>
                  <input
                    type="text"
                    value={updatedRequest.designation}
                    onChange={(e) => setUpdatedRequest({ ...updatedRequest, designation: e.target.value })}
                  />
                </p>

                {/* Reporting Head Signature and Reason */}
                <p><strong>Reporting Head's Signature:</strong>
                  <input
                    type="text"
                    value={updatedRequest.reportingHeadSignature}
                    onChange={(e) => setUpdatedRequest({ ...updatedRequest, reportingHeadSignature: e.target.value })}
                  />
                </p>
                <p><strong>Reason from Reporting Head:</strong>
                  <textarea
                    value={updatedRequest.reportingHeadReason}
                    onChange={(e) => setUpdatedRequest({ ...updatedRequest, reportingHeadReason: e.target.value })}>
                  </textarea>
                </p>

                {/* Sanctioning Authority Signature and Reason */}
                <p><strong>Sanctioning Authority's Signature:</strong>
                  <input
                    type="text"
                    value={updatedRequest.sanctioningAuthoritySignature}
                    onChange={(e) => setUpdatedRequest({ ...updatedRequest, sanctioningAuthoritySignature: e.target.value })}
                  />
                </p>
                <p><strong>Reason from Sanctioning Authority:</strong>
                  <textarea
                    value={updatedRequest.sanctioningAuthorityReason}
                    onChange={(e) => setUpdatedRequest({ ...updatedRequest, sanctioningAuthorityReason: e.target.value })}>
                  </textarea>
                </p>

                <p><strong>Attachments:</strong></p>
                {selectedRequest.attachments.length > 0 ? (
                  <ul>
                    {selectedRequest.attachments.map((file, index) => (
                      <li key={index}>
                        <a href={`http://localhost:8080/${file}`} target="_blank" rel="noopener noreferrer">{file}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No attachments available</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
