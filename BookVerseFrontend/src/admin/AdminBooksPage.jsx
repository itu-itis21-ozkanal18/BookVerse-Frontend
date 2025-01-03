import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import '../css/AdminComponents.css';

const AdminBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [bookForm, setBookForm] = useState({
        title: '',
        summary: '',
        page_count: '',
        author_name: '',
        category_name: '',
        cover: null
    });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'page_count', label: 'Pages' },
        { key: 'author_name', label: 'Author' },
        { key: 'category_name', label: 'Category' }
    ];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/api/admin/books/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooks(response.data || []);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.response?.data?.detail || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [token]);

    const handleEditClick = async (bookId) => {
        try {
            const response = await axios.get(`/api/api/admin/books/${bookId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const bookData = response.data;
            setEditingBook(bookData);
            setBookForm({
                title: bookData.title,
                summary: bookData.summary,
                page_count: bookData.page_count,
                author_name: bookData.author_name,
                category_name: bookData.category_name,
                cover: null
            });
            setShowModal(true);
        } catch (error) {
            setError("Failed to fetch book details");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title', bookForm.title);
        formData.append('summary', bookForm.summary);
        formData.append('page_count', bookForm.page_count);
        formData.append('author_name', bookForm.author_name);
        formData.append('category_name', bookForm.category_name);
        if (bookForm.cover instanceof File) {
            formData.append('cover', bookForm.cover);
        }

        try {
            let response;
            if (editingBook) {
                response = await axios.put(
                    `/api/api/admin/books/${editingBook.id}/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setBooks(books.map(book =>
                    book.id === editingBook.id ? response.data : book
                ));
            } else {
                response = await axios.post(
                    '/api/api/admin/books/',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setBooks([...books, response.data]);
            }
            setShowModal(false);
            setEditingBook(null);
            setBookForm({
                title: '',
                summary: '',
                page_count: '',
                author_name: '',
                category_name: '',
                cover: null
            });
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to save book");
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!window.confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            await axios.delete(`/api/api/admin/books/${bookId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(books.filter(book => book.id !== bookId));
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to delete book");
        }
    };

    const handleFileChange = (e) => {
        setBookForm({
            ...bookForm,
            cover: e.target.files[0]
        });
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <div className="admin-container">
            <h1>Books Management</h1>

            <button
                onClick={() => {
                    setEditingBook(null);
                    setBookForm({
                        title: '',
                        summary: '',
                        page_count: '',
                        author_name: '',
                        category_name: '',
                        cover: null
                    });
                    setShowModal(true);
                }}
                className="admin-add-button"
            >
                Add New Book
            </button>

            <AdminTable
                columns={columns}
                data={books}
                onDelete={handleDeleteBook}
                onRowClick={handleEditClick}
            />

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Title:</label>
                                <input
                                    type="text"
                                    value={bookForm.title}
                                    onChange={e => setBookForm({ ...bookForm, title: e.target.value })}
                                    className="admin-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Summary:</label>
                                <textarea
                                    value={bookForm.summary}
                                    onChange={e => setBookForm({ ...bookForm, summary: e.target.value })}
                                    className="admin-textarea"
                                />
                            </div>

                            <div className="form-group">
                                <label>Page Count:</label>
                                <input
                                    type="number"
                                    value={bookForm.page_count}
                                    onChange={e => setBookForm({ ...bookForm, page_count: e.target.value })}
                                    className="admin-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Author Name:</label>
                                <input
                                    type="text"
                                    value={bookForm.author_name}
                                    onChange={e => setBookForm({ ...bookForm, author_name: e.target.value })}
                                    className="admin-input"
                                    placeholder="Enter author name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category:</label>
                                <input
                                    type="text"
                                    value={bookForm.category_name}
                                    onChange={e => setBookForm({ ...bookForm, category_name: e.target.value })}
                                    className="admin-input"
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Cover Image:</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="admin-input"
                                    accept="image/*"
                                />
                            </div>

                            <div className="admin-form-buttons">
                                <button type="submit" className="admin-submit-button">
                                    {editingBook ? 'Update Book' : 'Add Book'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingBook(null);
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
        </div>
    );
};

export default AdminBooksPage;