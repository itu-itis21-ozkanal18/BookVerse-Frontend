import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import '../css/AdminComponents.css';

const AdminBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [bookForm, setBookForm] = useState({
        title: '',
        summary: '',
        page_count: '',
        author: '',
        category: '',
        cover: null
    });

    const token = localStorage.getItem("AT");

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'page_count', label: 'Pages' },
        {
            key: 'author',
            label: 'Author',
            render: (book) => {
                const author = authors.find(a => a.id === book.author);
                return author ? author.name : 'Unknown';
            }
        },
        {
            key: 'category',
            label: 'Category',
            render: (book) => {
                const category = categories.find(c => c.id === book.category);
                return category ? category.name : 'Unknown';
            }
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [booksRes, authorsRes, categoriesRes] = await Promise.all([
                    axios.get('/api/api/admin/books/', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('/api/api/admin/authors/', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('/api/api/admin/categories/', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setBooks(booksRes.data || []);
                setAuthors(authorsRes.data || []);
                setCategories(categoriesRes.data || []);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.response?.data?.detail || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                author: bookData.author,
                category: bookData.category,
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
        formData.append('author', bookForm.author);
        formData.append('category', bookForm.category);
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
            }
            setShowModal(false);
            setEditingBook(null);
            setBookForm({
                title: '',
                summary: '',
                page_count: '',
                author: '',
                category: '',
                cover: null
            });
            window.location.reload();
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to save book");
        }
    };

    const handleDeleteBook = async (bookId) => {
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
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type.toLowerCase();
            if (!fileType.includes('jpeg') && !fileType.includes('jpg')) {
                alert('Please upload only JPG/JPEG images');
                e.target.value = '';
                return;
            }
            setBookForm({
                ...bookForm,
                cover: file
            });
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <>
            <div className="admin-header">
                <h1>Books Management</h1>
                <button
                    onClick={() => {
                        setEditingBook(null);
                        setBookForm({
                            title: '',
                            summary: '',
                            page_count: '',
                            author: '',
                            category: '',
                            cover: null
                        });
                        setShowModal(true);
                    }}
                    className="admin-add-button"
                >
                    Add New Book
                </button>
            </div>

            <div className="admin-table-section">
                <AdminTable
                    columns={columns}
                    data={books}
                    onDelete={handleDeleteBook}
                    onRowClick={handleEditClick}
                />
            </div>

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
                                    placeholder="Enter book title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Summary:</label>
                                <textarea
                                    value={bookForm.summary}
                                    onChange={e => setBookForm({ ...bookForm, summary: e.target.value })}
                                    className="admin-textarea"
                                    placeholder="Enter book summary"
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
                                    placeholder="Enter page count"
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Author:</label>
                                <select
                                    value={bookForm.author}
                                    onChange={e => setBookForm({ ...bookForm, author: e.target.value })}
                                    className="admin-select"
                                    required
                                >
                                    <option value="">Select Author</option>
                                    {authors.map(author => (
                                        <option key={author.id} value={author.id}>
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Category:</label>
                                <select
                                    value={bookForm.category}
                                    onChange={e => setBookForm({ ...bookForm, category: e.target.value })}
                                    className="admin-select"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Cover Image:</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="admin-input"
                                    accept=".jpg,.jpeg"
                                />
                                <small className="file-hint">Only JPG/JPEG files are allowed</small>
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
        </>
    );
};

export default AdminBooksPage;