import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigatemport './css/AdminLeaveRequests.css';
import './css/AdminLeaveRequests.css';
const {API_URL_PROD} = process.env;
const AdminLeaveRequests = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedRequest, setUpdatedRequest] = useState({});
  const [showPreviewModal, setShowPreviewModal] = useState(false); // For Preview Modal
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`https://ems-be-v1.onrender.com/api/leave1/admin/leave-requests`);
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
      await axios.post(`https://ems-be-v1.onrender.com/api/leave1/admin/approve-reject/${id}`, {
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
    setMessage('');
  
    try {
      // Update leave request in the backend
      await axios.post(`https://ems-be-v1.onrender.com/api/leave1/admin/update-leave/${selectedRequest._id}`, updatedRequest);
  
      // Close modal and show success message
      setShowModal(false);
      setMessage('Leave request updated successfully');
  
      // Check if approval details changed before sending notification
      const approvalChanged =
        updatedRequest.reportingHeadSignature !== selectedRequest.reportingHeadSignature ||
        updatedRequest.reportingHeadReason !== selectedRequest.reportingHeadReason ||
        updatedRequest.sanctioningAuthoritySignature !== selectedRequest.sanctioningAuthoritySignature ||
        updatedRequest.sanctioningAuthorityReason !== selectedRequest.sanctioningAuthorityReason;
  
      if (approvalChanged) {
        axios.post(`https://ems-be-v1.onrender.com/api/admin/send-notification`, {
          employeeId: updatedRequest.employeeId,
          employeeName: updatedRequest.name,
          leaveType: updatedRequest.leaveType,
          fromDate: updatedRequest.fromDate,
          toDate: updatedRequest.toDate,
          numOfDays: updatedRequest.numOfDays,
          reason: updatedRequest.reason,
          designation: updatedRequest.designation,
          reportingHeadSignature: updatedRequest.reportingHeadSignature,
          reportingHeadReason: updatedRequest.reportingHeadReason,
          sanctioningAuthoritySignature: updatedRequest.sanctioningAuthoritySignature,
          sanctioningAuthorityReason: updatedRequest.sanctioningAuthorityReason
        }).catch(error => console.error("Error sending email notification:", error));
      }
  
      // Update local state to reflect changes immediately
      setLeaveRequests(leaveRequests.map((request) =>
        request._id === selectedRequest._id ? { ...request, ...updatedRequest } : request
      ));
    } catch (error) {
      setMessage('Error updating leave request');
      console.error('Error updating leave request:', error);
    }
  };
  
  
 
  // Open the modal and populate the selected request's data
  const openModal = (request) => {
    const storedAdminData = localStorage.getItem("adminDetails");
  
    let adminInfo = { adminId: "", email: "", designation: "" };
  
    if (storedAdminData) {
      try {
        adminInfo = JSON.parse(storedAdminData);
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    }
  
    console.log("Admin Info:", adminInfo); // Debugging - Check retrieved adminId
  
    setAdminId(adminInfo.adminId); // Store admin ID for reference
  
    setSelectedRequest(request);
    setUpdatedRequest({
      ...request,
      fromDate: new Date(request.fromDate).toISOString().split("T")[0],
      toDate: new Date(request.toDate).toISOString().split("T")[0],
      numOfDays: calculateNumOfDays(request.fromDate, request.toDate),
  
      // Preserve existing data
      reportingHeadSignature: request.reportingHeadSignature || "",
      reportingHeadReason: request.reportingHeadReason || "",
      sanctioningAuthoritySignature: request.sanctioningAuthoritySignature || "",
      sanctioningAuthorityReason: request.sanctioningAuthorityReason || "",
  
      // Set edit permissions based on admin role
      canEditReportingHeadSignature: adminInfo.adminId === "Report_Admin",
      canEditReportingHeadReason: adminInfo.adminId === "Report_Admin",
      canEditSanctioningAuthoritySignature: adminInfo.adminId === "Sanc_Admin",
      canEditSanctioningAuthorityReason: adminInfo.adminId === "Sanc_Admin",
    });
  
    console.log("Edit Permissions:", {
      canEditReportingHeadSignature: adminInfo.adminId === "Report_Admin",
      canEditReportingHeadReason: adminInfo.adminId === "Report_Admin",
      canEditSanctioningAuthoritySignature: adminInfo.adminId === "Sanc_Admin",
      canEditSanctioningAuthorityReason: adminInfo.adminId === "Sanc_Admin",
    });
  
    setShowModal(true);
  };
  

  
  
  // Close the modal and reset states
  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setUpdatedRequest({});
  };

  // Preview the updated leave request details
  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  // Close the preview modal
  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  return (
    <div className="container">
      <h3>Pending Leave Requests</h3>
      <button className="home-button" onClick={() => navigate('/admin/dashboard')}>Home</button>

    
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
                <td>{request.leaveType === 'PL' ? 'PL' : request.leaveType}</td>
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
                    onChange={(e) => setUpdatedRequest({ ...updatedRequest, reason: e.target.value })}
                  />
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
    onChange={(e) =>
      setUpdatedRequest({ ...updatedRequest, reportingHeadSignature: e.target.value })
    }
    disabled={!updatedRequest.canEditReportingHeadSignature} // Apply permissions
  />
</p>

<p><strong>Reason from Reporting Head:</strong>
  <textarea
    value={updatedRequest.reportingHeadReason}
    onChange={(e) =>
      setUpdatedRequest({ ...updatedRequest, reportingHeadReason: e.target.value })
    }
    disabled={!updatedRequest.canEditReportingHeadReason} // Apply permissions
  />
</p>

<p><strong>Sanctioning Authority's Signature:</strong>
  <input
    type="text"
    value={updatedRequest.sanctioningAuthoritySignature}
    onChange={(e) =>
      setUpdatedRequest({ ...updatedRequest, sanctioningAuthoritySignature: e.target.value })
    }
    disabled={!updatedRequest.canEditSanctioningAuthoritySignature} // Apply permissions
  />
</p>

<p><strong>Reason from Sanctioning Authority:</strong>
  <textarea
    value={updatedRequest.sanctioningAuthorityReason}
    onChange={(e) =>
      setUpdatedRequest({ ...updatedRequest, sanctioningAuthorityReason: e.target.value })
    }
    disabled={!updatedRequest.canEditSanctioningAuthorityReason} // Apply permissions
  />
</p>



                {/* Display attachments */}
                {updatedRequest.attachments && updatedRequest.attachments.length > 0 && (
                  <div>
                    <strong>Attachments:</strong>
                    <ul>
                      {updatedRequest.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a href={`${API_URL_PROD}/${attachment}`} target="_blank" rel="noopener noreferrer">{attachment}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button type="button" className="btn btn-info" onClick={handlePreview}>Preview</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview Leave Request</h5>
                <button type="button" className="btn-close" onClick={closePreviewModal}></button>
              </div>
              <div className="modal-body">
                <div className="preview-container">
                  <div className="preview-left">
                    <p><strong>Employee ID:</strong> {updatedRequest.employeeId}</p>
                    <p><strong>Employee Name:</strong> {updatedRequest.name}</p>
                    <p><strong>Leave Type:</strong> {updatedRequest.leaveType}</p>
                    <p><strong>From Date:</strong> {updatedRequest.fromDate}</p>
                    <p><strong>To Date:</strong> {updatedRequest.toDate}</p>
                    <p><strong>Number of Days:</strong> {updatedRequest.numOfDays}</p>
                  </div>
                  <div className="preview-right">
                    <p><strong>Reason:</strong> {updatedRequest.reason}</p>
                    <p><strong>Designation:</strong> {updatedRequest.designation}</p>
                    <p><strong>Reporting Head Signature:</strong> {updatedRequest.reportingHeadSignature}</p>
                    <p><strong>Reason from Reporting Head:</strong> {updatedRequest.reportingHeadReason}</p>
                    <p><strong>Sanctioning Authority Signature:</strong> {updatedRequest.sanctioningAuthoritySignature}</p>
                    <p><strong>Reason from Sanctioning Authority:</strong> {updatedRequest.sanctioningAuthorityReason}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closePreviewModal}>Close Preview</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
