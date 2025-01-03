import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminComponents.css';

const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const token = localStorage.getItem("AT");

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!token) {
                setIsAdmin(false);
                return;
            }

            try {
                const response = await axios.get('/api/get-user/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setIsAdmin(response.data.data.is_superuser === true);
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [token]);

    // Prevent rendering until admin status is determined
    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    // Redirect to home if not an admin
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;