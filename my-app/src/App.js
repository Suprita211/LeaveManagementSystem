import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';

// Import Components
import EmployeeForm from './Components/EmployeeLeaveForm';
import EmpMaster from './Components/Emp_Master';
import View_UpdateEmployee from './Components/view_updateemployee';

// import ViewSingleEmployee from './Components/viewsingleemployee';
import LeaveRecords from './Components/LeaveRecordsDisplay';
import LeaveDetailsForm from './Components/leavedetailsForm';
import EmployeeView from './Components/employeelist'
import AddEmployeeForm from './Components/addemployeeform';

import AdminLeaveRequests from './Components/Adminapproval';
import AdminAuth from './Components/Admin';
import AdminLogin from './Components/Adminlogin';
import AdminLogout from './Components/adminlogout';
import AdminDashboard from './Components/AdminDashboard';
import HomePage from './Components/homepage';
import EmployeeDetails from './Components/viewsingleemployee'



const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("adminDetails"));
  console.log("Stored User Data:", user);
  return user && (user.designation === "Reporting Head" || user.designation === "Sanctioning Authority" ) ;
};


// Protected Route Component
const AdminRoute = ({ element }) => {
  return isAdmin() ? element : <Navigate to="/admin/login" />;
};
function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
        <Route path="/" element={<HomePage />} /> 
          <Route path="/emp-leaveform" element={<EmployeeForm />} />
          <Route path="/emp-master" element={<EmpMaster />} />
          <Route path="/view-update" element={<View_UpdateEmployee />} />
          <Route path="/search-employee" element={<EmployeeDetails />} />
          <Route path="/leave-records" element={<LeaveRecords />} />
          <Route path="/leave-details" element={<LeaveDetailsForm />} /> 
          <Route path="/employeeDetailsView" element={<EmployeeView />} /> 
          <Route path="/addEmplyee" element={<AddEmployeeForm />} /> 
          <Route path="/AdminAuth" element={<AdminAuth />} /> 
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/AdminApproval"   element={<AdminRoute element={<AdminLeaveRequests />} />} />  
          <Route path="/admin/dashboard"  element={<AdminRoute element={<AdminDashboard />} />}/> 
          <Route path="/admin/logout"   element={<AdminRoute element={<AdminLogout />} />}/> 
          <Route path="*" element={<Navigate to="/" />} />
         
         
         

       

        </Routes>
      
      </div>
    </Router>
  );
}

export default App;
