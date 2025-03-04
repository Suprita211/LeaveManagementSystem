import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const {API_URL_PROD} = process.env;
const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await fetch(`https://ems-be-v1.onrender.com/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save token & admin details in local storage
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminDetails", JSON.stringify(data.admin));

            alert("Login successful! Redirecting...");

            // Redirect to /AdminApproval
            navigate("/admin/dashboard");

        } catch (error) {
            setError(error.message);
            console.error("Login Error:", error);
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
