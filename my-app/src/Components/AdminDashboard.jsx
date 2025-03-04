import React from 'react';
import { useNavigate } from 'react-router-dom';
const {API_URL_PROD} = process.env;
const AdminDashboard = () => {
    const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminDetails');
        alert('Logged out successfully!');
        navigate('/admin/login');
    };

    const handleLeaveRequest = () => {
        navigate('/AdminApproval');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                <div>
                    <button onClick={handleLeaveRequest} className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded mr-4">Leave Requests</button>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-black font-bold py-2 px-4 rounded">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center p-6">
                {adminDetails ? (
                    <div className="bg-white shadow-md rounded-lg p-6 text-center w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-2">Welcome, {adminDetails.designation}</h2>
                        <p className="text-gray-700">Email: {adminDetails.email}</p>
                    </div>
                ) : (
                    <p className="text-red-500">No admin logged in.</p>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
                <p>&copy; {new Date().getFullYear()} Admin Panel. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
