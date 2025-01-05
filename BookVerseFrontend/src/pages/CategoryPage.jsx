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
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const limit = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                if (categoryId === 'all') {
                    const response = await axios.get('/api/get-categories/');
                    setCategories(response.data.data);
                } else {
                    const offset = (currentPage - 1) * limit;
                    const [booksResponse, categoryResponse] = await Promise.all([
                        axios.get(`/api/get-book/?category_id=${categoryId}&limit=${limit}&offset=${offset}`),
                        axios.get(`/api/get-categories/?category_id=${categoryId}`)
                    ]);

                    setBooks(booksResponse.data.data);
                    setPagination(booksResponse.data.pagination);
                    setCategoryName(categoryResponse.data.data[0]?.name || '');
                }
            } catch (error) {
                setError(error.response?.data?.error || "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId, currentPage]);

    const handleCategoryClick = (category) => {
        navigate(`/category/${category.id}`);
    };

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const getTotalPages = () => {
        if (!pagination) return 1;
        return Math.ceil(pagination.total / pagination.limit);
    };

    const renderPageOptions = (totalPages) => {
        return Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
            <option key={page} value={page}>
                Page {page}
            </option>
        ));
    };

    return (
        <div>
            <HeaderComponent />
            <div className="category-container">
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : categoryId === 'all' ? (
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
                    <div className="single-category">
                        <h1 className="category-title">{categoryName}</h1>
                        {books.length > 0 ? (
                            <>
                                <div className="page-selector">
                                    <button
                                        className="page-button"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                    >
                                        Previous
                                    </button>
                                    <select
                                        className="page-select"
                                        value={currentPage}
                                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                                    >
                                        {renderPageOptions(getTotalPages())}
                                    </select>
                                    <span className="total-pages">
                                        of {getTotalPages()} pages
                                    </span>
                                    <button
                                        className="page-button"
                                        disabled={currentPage >= getTotalPages()}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="books-grid">
                                    {books.map((book) => (
                                        <div
                                            key={book.id}
                                            className="book-card"
                                            onClick={() => handleBookClick(book.id)}
                                        >
                                            <img src={book.cover} alt={book.title} />
                                            <div className="book-info">
                                                <h3>{book.title}</h3>
                                                <p>{book.author.name}</p>
                                                <div className="rating">★ {book.average_rating.toFixed(1)}</div>
                                            </div>
                                        </div>
                                    ))}
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