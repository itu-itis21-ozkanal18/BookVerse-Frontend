import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import '../css/AdminComponents.css';

const AdminLayout = () => {
    return (
        <div className="admin-dashboard">
            <HeaderComponent />
            <div className="admin-container">
                <div className="admin-sidebar">
                    <nav>
                        <ul>
                            <li><Link to="/admin/books">Books Management</Link></li>
                            <li><Link to="/admin/users">User Management</Link></li>
                            <li><Link to="/admin/comments">Comment Management</Link></li>
                            <li><Link to="/admin/categories">Category Management</Link></li>
                            <li><Link to="/admin/authors">Author Management</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;