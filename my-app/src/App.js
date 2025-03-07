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
import HomeLoginPage from './Components/homepage';
import EmployeeDetails from './Components/viewsingleemployee'


//other
import SignInPage from "./Components/SignInPage";
import SignUpPage from "./Components/SignUpPage";
import HomePage from "./Components/HomePage copy";
import UpdateEmployee from "./Components/UpdateEmployee";
import Payslip from "./Components/Payslip";
import AddSalaryForm from "./Components/AddSalaryForm";
import EmployeeManager from "./Components/EmployeeMaster";
import EmployeeList from "./Components/EmployeeList copy";
import SaveSalaries from "./Components/SaveSalaries"
import ApprovedLeaveList from './Components/ApprovedLeaveList';
import AbsentList from './Components/AbsentList';
import AddHoliday from './Components/HolidayListEntry';
import AddBankForm from './Components/AddBankForm';
import BankDetails from './Components/BankDetails';

const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("adminDetails"));
  console.log("Stored User Data:", user);
  return user && (user.designation === "Reporting Head" || user.designation === "Sanctioning Authority" ) ;
};


// Protected Route Component
const UserRoute = ({ element }) => {
  return isUser() ? element : <Navigate to="/employee/login" />;
};

// Function to check if the user is authenticated and an admin
const isUser = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  console.log("Stored User Data:", user);
  return user && user.usertype === "admin";
};


// Protected Route Component
const AdminRoute = ({ element }) => {
  return isAdmin() ? element : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
        <Route path="/" element={<HomeLoginPage />} /> 
          <Route path="/emp-leaveform" element={<EmployeeForm />} />
          <Route path="/emp-master" element={<EmpMaster />} />
          <Route path="/view-employee" element={<View_UpdateEmployee />} />
          <Route path="/update-employee" element={<EmployeeDetails />} />
          <Route path="/leave-records" element={<LeaveRecords />} />
          <Route path="/leave-details" element={<LeaveDetailsForm />} /> 
          <Route path="/employeeDetailsView" element={<EmployeeView />} /> 
          <Route path="/addabsent" element={<AbsentList />} /> 
          {/* Admin */}
          <Route path="/AdminAuth" element={<AdminAuth />} /> 
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/AdminApproval"   element={<AdminRoute element={<AdminLeaveRequests />} />} />  
          <Route path="/admin/dashboard"  element={<AdminRoute element={<AdminDashboard />} />}/> 
          <Route path="/admin/logout"   element={<AdminRoute element={<AdminLogout />} />}/> 
          <Route path="*" element={<Navigate to="/" />} />
         
         
         
           {/* Public Routes */}
           <Route path="/employee/login" element={<SignInPage />} />
          <Route path="/employee/signup" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* Protected Routes (Only Admins can access) */}
          <Route path="/updateEmployee" element={<UserRoute element={<UpdateEmployee />} />} />
          <Route path="/emp-salary" element={<UserRoute element={<Payslip />} />} />
          <Route path="/add-salary" element={<UserRoute element={<AddSalaryForm />} />} />
          <Route path="/empMaster" element={<UserRoute element={<EmployeeManager />} />} />
          <Route path="/emplist" element={<UserRoute element={<EmployeeList />} />} />
          <Route path="/save-salaries" element={<UserRoute element={<SaveSalaries />} />} />
          <Route path="/EmpLeaveStatus" element={<UserRoute element= {<ApprovedLeaveList />}/>} />
          <Route path='/addbank' element = {<UserRoute element={<AddBankForm />} />}/>
          <Route path='/bankdetails' element = {<UserRoute element={<BankDetails />} />}/>
          <Route path="/AddHoliday" element={<UserRoute element={<AddHoliday />} />}/>

          {/* Redirect unknown routes to SignIn */}
          <Route path="*" element={<Navigate to="/signin" />} />
       

        </Routes>
      
      </div>
    </Router>
  );
}

export default App;
