import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminPagination from '../components/AdminPagination';
import '../css/AdminComponents.css';

const AdminUserCommentsPage = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        user: '',
        book: '',
        date__gte: '',
        date__lte: ''
    });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        {
            key: 'user',
            label: 'User',
            // No need for nested object access
            render: (comment) => comment.user
        },
        {
            key: 'book',
            label: 'Book',
            // No need for nested object access
            render: (comment) => comment.book
        },
        { key: 'content', label: 'Content' },
        {
            key: 'date',
            label: 'Date',
            render: (comment) => new Date(comment.date).toLocaleDateString()
        }
    ];

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    page,
                    ...filters
                });
                const response = await axios.get(`/api/api/admin/user-comments/?${params}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setComments(response.data.results || []);
                setTotalPages(Math.ceil(response.data.count / 10));
            } catch (error) {
                setError(error.response?.data?.detail || "Failed to fetch comments");
                setComments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [page, filters, token]);

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`/api/api/admin/user-comments/${commentId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to delete comment");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(1);
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <div className="admin-container">
            <h1>Comment Management</h1>

            <div className="admin-filters">
                <input
                    type="text"
                    name="user"  // Changed from user__username
                    placeholder="Filter by Username"
                    value={filters.user}
                    onChange={handleFilterChange}
                    className="admin-filter-input"
                />
                <input
                    type="text"
                    name="book"  // Changed from book__title
                    placeholder="Filter by Book Title"
                    value={filters.book}
                    onChange={handleFilterChange}
                    className="admin-filter-input"
                />
                <input
                    type="date"
                    name="date__gte"
                    value={filters.date__gte}
                    onChange={handleFilterChange}
                    className="admin-filter-input"
                />
                <input
                    type="date"
                    name="date__lte"
                    value={filters.date__lte}
                    onChange={handleFilterChange}
                    className="admin-filter-input"
                />
            </div>

            <AdminTable
                columns={columns}
                data={comments}
                onDelete={handleDeleteComment}
            />

            {totalPages > 1 && (
                <AdminPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default AdminUserCommentsPage;