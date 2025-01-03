import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminPagination from '../components/AdminPagination';
import '../css/AdminComponents.css';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '' });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' }
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/api/admin/categories/', {
                    params: { page },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(response.data.results || []);
                setTotalPages(Math.ceil(response.data.count / 10));
            } catch (error) {
                setError(error.response?.data?.detail || "Failed to fetch categories");
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [page, token]);

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`/api/api/admin/categories/${categoryId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(categories.filter(category => category.id !== categoryId));
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to delete category");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const response = await axios.put(
                    `/api/admin/categories/${editingCategory.id}/`,
                    editingCategory,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCategories(categories.map(category =>
                    category.id === editingCategory.id ? response.data : category
                ));
                setEditingCategory(null);
            } else {
                const response = await axios.post(
                    '/api/admin/categories/',
                    newCategory,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCategories([...categories, response.data]);
                setNewCategory({ name: '' });
            }
        } catch (error) {
            setError(error.response?.data?.detail || "Operation failed");
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <div className="admin-container">
            <h1>Category Management</h1>

            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    type="text"
                    value={editingCategory ? editingCategory.name : newCategory.name}
                    onChange={(e) =>
                        editingCategory
                            ? setEditingCategory({ ...editingCategory, name: e.target.value })
                            : setNewCategory({ name: e.target.value })
                    }
                    placeholder="Category Name"
                    required
                    className="admin-input"
                />
                <div className="admin-form-buttons">
                    <button type="submit" className="admin-submit-button">
                        {editingCategory ? "Update Category" : "Add Category"}
                    </button>
                    {editingCategory && (
                        <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="admin-cancel-button"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <AdminTable
                columns={columns}
                data={categories}
                onDelete={handleDeleteCategory}
                onEdit={setEditingCategory}
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

export default AdminCategoriesPage;