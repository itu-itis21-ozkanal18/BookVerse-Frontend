import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminPagination from '../components/AdminPagination';
import '../css/AdminComponents.css';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({
        name: ''
    });

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
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(response.data || []);
            } catch (error) {
                setError(error.response?.data?.detail || "Failed to fetch categories");
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [token]);

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
                await axios.put(
                    `/api/api/admin/categories/${editingCategory.id}/`,
                    categoryForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    '/api/api/admin/categories/',
                    categoryForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            window.location.reload();
        } catch (error) {
            setError(error.response?.data?.detail || "Operation failed");
        }
    };

    const handleEditClick = async (categoryId) => {
        try {
            setShowModal(true);
            setEditingCategory(categories.find(cat => cat.id === categoryId));
            setCategoryForm({
                name: categories.find(cat => cat.id === categoryId).name
            });
        } catch (error) {
            setError("Failed to fetch category details");
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <>
            <div className="admin-header">
                <h1>Category Management</h1>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({ name: '' });
                        setShowModal(true);
                    }}
                    className="admin-add-button"
                >
                    Add New Category
                </button>
            </div>

            <AdminTable
                columns={columns}
                data={categories}
                onDelete={handleDeleteCategory}
                onRowClick={handleEditClick}
            />

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Category Name:</label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    className="admin-input"
                                    required
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div className="admin-form-buttons">
                                <button type="submit" className="admin-submit-button">
                                    {editingCategory ? 'Update Category' : 'Add Category'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingCategory(null);
                                        setCategoryForm({ name: '' });
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

export default AdminCategoriesPage;