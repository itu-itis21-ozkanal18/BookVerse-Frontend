// src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import '../css/AdminComponents.css';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        is_active: false,
        is_staff: false,
        is_superuser: false
    });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        {
            key: 'is_active',
            label: 'Status',
            render: (user) => user.is_active ?
                <span className="status-active">Active</span> :
                <span className="status-inactive">Inactive</span>
        },
        {
            key: 'is_staff',
            label: 'Staff Status',
            render: (user) => user.is_staff ? 'Staff' : 'Regular User'
        }
    ];

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/api/admin/users/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data || []);
            setError(null);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.response?.data?.detail || "Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = async (userId) => {
        try {
            const response = await axios.get(`/api/api/admin/users/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingUser(response.data);
            setEditForm(response.data);
            setShowModal(true);
        } catch (error) {
            setError("Failed to fetch user details");
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `/api/api/admin/users/${editingUser.id}/`,
                editForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(user =>
                user.id === editingUser.id ? response.data : user
            ));
            setShowModal(false);
            setEditingUser(null);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to update user");
        }
    };

    const handleDeleteUser = async (userId) => {

        try {
            setLoading(true);
            await axios.delete(`/api/api/admin/users/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Delete error:", error);
            alert(error.response?.data?.detail || "Failed to delete user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <div className="admin-container">
            <h1>User Management</h1>

            <AdminTable
                columns={columns}
                data={users}
                onDelete={handleDeleteUser}
                onRowClick={handleEditClick}
            />

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Edit User</h2>
                        <form onSubmit={handleUpdateUser} className="admin-form">
                            <div className="form-group">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                    className="admin-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="admin-input"
                                    required
                                />
                            </div>
                            <div className="form-group-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editForm.is_active}
                                        onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="form-group-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editForm.is_staff}
                                        onChange={e => setEditForm({ ...editForm, is_staff: e.target.checked })}
                                    />
                                    Staff Status
                                </label>
                            </div>
                            <div className="form-group-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editForm.is_superuser}
                                        onChange={e => setEditForm({ ...editForm, is_superuser: e.target.checked })}
                                    />
                                    Superuser Status
                                </label>
                            </div>
                            <div className="admin-form-buttons">
                                <button type="submit" className="admin-submit-button">
                                    Update User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="admin-cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;