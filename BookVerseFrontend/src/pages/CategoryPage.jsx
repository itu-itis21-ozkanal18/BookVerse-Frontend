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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

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
                    // Single Category View
                    <div className="single-category">
                        <h1 className="category-title">{categoryName}</h1>
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
                                        <div className="rating">★ {book.average_rating}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;