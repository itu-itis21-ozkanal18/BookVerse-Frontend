import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import '../css/CategoryPage.css';

function CategoryPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categoryName, setCategoryName] = useState("");

    // Pagination States
    const [bookPage, setBookPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");
                setBookPage(1); // Reset to first page when category changes

                if (categoryId === 'all') {
                    const response = await axios.get('/api/get-categories/');
                    setCategories(response.data.data);
                } else {
                    const [booksResponse, categoryResponse] = await Promise.all([
                        axios.get(`/api/get-book/?category_id=${categoryId}`),
                        axios.get(`/api/get-categories/?category_id=${categoryId}`)
                    ]);
                    setBooks(booksResponse.data.data);
                    setCategoryName(categoryResponse.data.data[0]?.name || '');
                }
            } catch (error) {
                setError(error.response?.data?.error || "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    const handleCategoryClick = (category) => {
        navigate(`/category/${category.id}`);
    };

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    // Pagination Handlers
    const totalPages = Math.ceil(books.length / itemsPerPage);

    const handlePreviousPage = () => {
        setBookPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setBookPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePageSelect = (e) => {
        setBookPage(Number(e.target.value));
    };

    // Sliced Books for Current Page
    const paginatedBooks = books.slice((bookPage - 1) * itemsPerPage, bookPage * itemsPerPage);

    return (
        <div>
            <HeaderComponent />
            <div className="category-container">
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : categoryId === 'all' ? (
                    // All Categories View
                    <div className="all-categories">
                        <h1 className="category-title">All Categories</h1>
                        <div className="categories-grid">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="category-card"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <h3>{category.name}</h3>
                                    <p>{category.book_count} Books</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Single Category View with Pagination
                    <div className="single-category">
                        <h1 className="category-title">{categoryName}</h1>
                        {books.length > 0 ? (
                            <>
                                <div className="books-grid">
                                    {paginatedBooks.map((book) => (
                                        <div
                                            key={book.id}
                                            className="book-card"
                                            onClick={() => handleBookClick(book.id)}
                                        >
                                            <img src={book.cover} alt={book.title} />
                                            <div className="book-info">
                                                <h3>{book.title}</h3>
                                                <p>{book.author.name}</p>
                                                <div className="rating">★ {book.average_rating}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Pagination Controls */}
                                <div className="pagination-controls">
                                    <button
                                        className="page-button"
                                        disabled={bookPage === 1}
                                        onClick={handlePreviousPage}
                                    >
                                        Previous
                                    </button>
                                    <select
                                        className="page-select"
                                        value={bookPage}
                                        onChange={handlePageSelect}
                                    >
                                        {[...Array(totalPages)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                Page {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="page-button"
                                        disabled={bookPage >= totalPages}
                                        onClick={handleNextPage}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="no-results">No books found in "{categoryName}"</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;