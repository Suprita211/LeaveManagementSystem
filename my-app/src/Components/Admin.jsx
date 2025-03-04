import React, { useState } from 'react';
const {API_URL_PROD} = process.env;
const AdminAuth = ({ isLogin, setIsLogin }) => {
    const [formData, setFormData] = useState({
        adminId: '',
        email: '',
        password: '',
        designation: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const API_BASE_URL = `${API_URL_PROD}`; // Ensure correct backend URL
        const endpoint = isLogin ? `${API_URL_PROD}/api/admin/login` : `${API_BASE_URL}/api/admin/signup`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // Ensure response is valid JSON
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error('Invalid JSON response:', text);
                alert('Unexpected response from the server.');
                return;
            }

            alert(data.message);

            if (isLogin && data.token) {
                localStorage.setItem('adminToken', data.token);
                window.location.href = "/admin/dashboard"; // Redirect to dashboard
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Failed to connect to server.');
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Admin Login' : 'Admin Signup'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <label>Admin ID:</label>
                        <input
                            type="text"
                            name="adminId"
                            value={formData.adminId}
                            onChange={handleChange}
                            required
                        />
                        <label>Designation:</label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>

            {typeof setIsLogin === "function" && (
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Switch to Signup' : 'Switch to Login'}
                </button>
            )}
        </div>
    );
};

export default AdminAuth;
