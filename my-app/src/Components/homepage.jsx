import React from "react";
import { useNavigate } from "react-router-dom";
import SignInPage from "./SignInPage";

import "./css/HomePage.css"; // Custom CSS file for styling

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid homepage">
      <div className="row vh-100">
        {/* Left Section - Admin Login */}
        <div className="col-md-6 admin-section d-flex flex-column justify-content-center align-items-center">
          <h2 className="mb-4">Admin Panel</h2>
          <p className="text-center">Manage employee records and leave requests.</p>
          <button
            className="btn btn-danger mt-3 px-4 py-2"
            onClick={() => navigate("/admin/login")}
          >
            Admin Login
          </button>
        </div>

        {/* Right Section - Employee Login & Signup */}
        <div className="col-md-6 employee-section d-flex flex-column justify-content-center align-items-center">
          <h2 className="mb-4">Employee Portal</h2>
          <p className="text-center">Access your leave details, salary, and more.</p>
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary px-4 py-2"
              onClick={() => navigate("/employee/login")}
            >
              Employee Login
            </button>
            <button
              className="btn btn-success px-4 py-2"
              onClick={() => navigate("/employee/signup")}
            >
              Employee Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
