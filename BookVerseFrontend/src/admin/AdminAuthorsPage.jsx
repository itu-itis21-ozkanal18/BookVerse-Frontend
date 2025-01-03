import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminPagination from '../components/AdminPagination';
import '../css/AdminComponents.css';

const AdminAuthorsPage = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [newAuthor, setNewAuthor] = useState({ name: '', bio: '' });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'bio', label: 'Bio' }
    ];


    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/api/admin/authors/', {
                    params: { page },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAuthors(response.data.results || []);
                setTotalPages(Math.ceil(response.data.count / 10));
            } catch (error) {
                setError(error.response?.data?.detail || "Failed to fetch authors");
                setAuthors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, [page, token]);

    const handleDeleteAuthor = async (authorId) => {
        try {
            await axios.delete(`/api/admin/authors/${authorId}/`, {
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
                const response = await axios.put(
                    `/api/api/admin/authors/${editingAuthor.id}/`,
                    editingAuthor,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAuthors(authors.map(author =>
                    author.id === editingAuthor.id ? response.data : author
                ));
                setEditingAuthor(null);
            } else {
                const response = await axios.post(
                    '/api/api/admin/authors/',
                    newAuthor,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAuthors([...authors, response.data]);
                setNewAuthor({ name: '', bio: '' });
            }
        } catch (error) {
            setError(error.response?.data?.detail || "Operation failed");
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <div className="admin-container">
            <h1>Author Management</h1>

            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    type="text"
                    value={editingAuthor ? editingAuthor.name : newAuthor.name}
                    onChange={(e) =>
                        editingAuthor
                            ? setEditingAuthor({ ...editingAuthor, name: e.target.value })
                            : setNewAuthor({ ...newAuthor, name: e.target.value })
                    }
                    placeholder="Author Name"
                    required
                    className="admin-input"
                />
                <textarea
                    value={editingAuthor ? editingAuthor.bio : newAuthor.bio}
                    onChange={(e) =>
                        editingAuthor
                            ? setEditingAuthor({ ...editingAuthor, bio: e.target.value })
                            : setNewAuthor({ ...newAuthor, bio: e.target.value })
                    }
                    placeholder="Author Bio"
                    className="admin-textarea"
                />
                <div className="admin-form-buttons">
                    <button type="submit" className="admin-submit-button">
                        {editingAuthor ? "Update Author" : "Add Author"}
                    </button>
                    {editingAuthor && (
                        <button
                            type="button"
                            onClick={() => setEditingAuthor(null)}
                            className="admin-cancel-button"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <AdminTable
                columns={columns}
                data={authors}
                onDelete={handleDeleteAuthor}
                onEdit={setEditingAuthor}
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

export default AdminAuthorsPage;