import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminPagination from '../components/AdminPagination';
import '../css/AdminComponents.css';

const AdminAuthorsPage = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [authorForm, setAuthorForm] = useState({
        name: '',
        book_count: 0
    });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
    ];

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/api/admin/authors/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAuthors(response.data || []);
            } catch (error) {
                setError(error.response?.data?.detail || "Failed to fetch authors");
                setAuthors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, [token]);

    const handleDeleteAuthor = async (authorId) => {
        try {
            await axios.delete(`/api/api/admin/authors/${authorId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuthors(authors.filter(author => author.id !== authorId));
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to delete author");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAuthor) {
                await axios.put(
                    `/api/api/admin/authors/${editingAuthor.id}/`,
                    authorForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    '/api/api/admin/authors/',
                    authorForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            window.location.reload();
        } catch (error) {
            setError(error.response?.data?.detail || "Operation failed");
        }
    };

    const handleEditClick = async (authorId) => {
        try {
            setShowModal(true);
            setEditingAuthor(authors.find(auth => auth.id === authorId));
            setAuthorForm({
                name: authors.find(auth => auth.id === authorId).name,
                book_count: authors.find(auth => auth.id === authorId).book_count
            });
        } catch (error) {
            setError("Failed to fetch author details");
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <>
            <div className="admin-header">
                <h1>Author Management</h1>
                <button
                    onClick={() => {
                        setEditingAuthor(null);
                        setAuthorForm({ name: '', book_count: 0 });
                        setShowModal(true);
                    }}
                    className="admin-add-button"
                >
                    Add New Author
                </button>
            </div>

            <AdminTable
                columns={columns}
                data={authors}
                onDelete={handleDeleteAuthor}
                onRowClick={handleEditClick}
            />

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingAuthor ? 'Edit Author' : 'Add New Author'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Author Name:</label>
                                <input
                                    type="text"
                                    value={authorForm.name}
                                    onChange={e => setAuthorForm({ ...authorForm, name: e.target.value })}
                                    className="admin-input"
                                    required
                                    placeholder="Enter author name"
                                />
                            </div>
                            <div className="admin-form-buttons">
                                <button type="submit" className="admin-submit-button">
                                    {editingAuthor ? 'Update Author' : 'Add Author'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingAuthor(null);
                                        setAuthorForm({ name: '', book_count: 0 });
                                    }}
                                    className="admin-cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAuthorsPage;