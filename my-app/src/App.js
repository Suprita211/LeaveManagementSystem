import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import EmployeeForm from './Components/EmployeeLeaveForm';
import EmpMaster from './Components/Emp_Master';
import View_UpdateEmployee from './Components/view_updateemployee';

import ViewSingleEmployee from './Components/viewsingleemployee';
import LeaveRecords from './Components/LeaveRecordsDisplay';
import LeaveDetailsForm from './Components/leavedetailsForm';
import EmployeeView from './Components/employeelist'
import AddEmployeeForm from './Components/addemployeeform';

import AdminLeaveRequests from './Components/Adminapproval';


function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/emp-leaveform" element={<EmployeeForm />} />
          <Route path="/emp-master" element={<EmpMaster />} />
          <Route path="/view-update" element={<View_UpdateEmployee />} />
          <Route path="/search-employee" element={<ViewSingleEmployee />} />
          <Route path="/leave-records" element={<LeaveRecords />} />
          <Route path="/leave-details" element={<LeaveDetailsForm />} /> 
          <Route path="/employeeDetailsView" element={<EmployeeView />} /> 
          <Route path="/addEmplyee" element={<AddEmployeeForm />} /> 
          <Route path="/AdminApproval" element={<AdminLeaveRequests />} /> 
         

       

        </Routes>
      
      </div>
    </Router>
  );
}

export default App;
