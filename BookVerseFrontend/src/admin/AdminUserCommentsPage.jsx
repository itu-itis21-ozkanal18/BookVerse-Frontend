import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminPagination from '../components/AdminPagination';
import '../css/AdminComponents.css';

const AdminUserCommentsPage = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [commentForm, setCommentForm] = useState({
        content: ''
    });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'user', label: 'User' },
        { key: 'book', label: 'Book' },
        { key: 'content', label: 'Content' },
        {
            key: 'date',
            label: 'Date',
            render: (comment) => new Date(comment.date).toLocaleString()
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/api/admin/user-comments/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setComments(response.data || []);
            } catch (error) {
                setError(error.response?.data?.detail || "Failed to fetch comments");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`/api/api/admin/user-comments/${commentId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to delete comment");
        }
    };

    const handleEditClick = async (commentId) => {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
            setEditingComment(comment);
            setCommentForm({ content: comment.content });
            setShowModal(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `/api/api/admin/user-comments/${editingComment.id}/`,
                commentForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.location.reload();
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to update comment");
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <>
            <div className="admin-header">
                <h1>Comment Management</h1>
            </div>

            <AdminTable
                columns={columns}
                data={comments}
                onDelete={handleDeleteComment}
                onRowClick={handleEditClick}
            />

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Edit Comment</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Content:</label>
                                <textarea
                                    value={commentForm.content}
                                    onChange={e => setCommentForm({ content: e.target.value })}
                                    className="admin-textarea"
                                    required
                                    rows="4"
                                />
                            </div>
                            <div className="admin-form-buttons">
                                <button type="submit" className="admin-submit-button">
                                    Update Comment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingComment(null);
                                        setCommentForm({ content: '' });
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

export default AdminUserCommentsPage;