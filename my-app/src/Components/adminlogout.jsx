import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('adminToken');   // Remove token
        localStorage.removeItem('adminDetails'); // Remove admin details
        alert("Logged out successfully!");
        navigate('/admin/login');  // Redirect to login page
    }, [navigate]);

    return null;
};

export default AdminLogout;
