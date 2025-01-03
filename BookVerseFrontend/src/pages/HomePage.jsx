import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import '../css/HomePage.css';

function HomePage() {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("AT");

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                setLoading(true);
                const [featuredResponse, newReleasesResponse, popularResponse, categoriesResponse] = await Promise.all([
                    axios.get('/api/get-book/?featured=true&limit=5'),
                    axios.get('/api/get-book/?sort=newest&limit=10'),
                    token!=null?
                        axios.get('/api/recommended-books/',{
                            headers: { Authorization: `Bearer ${token}` }
                        }):axios.get('/api/get-book/?featured=true&limit=10'),
                    axios.get('/api/get-categories/')
                ]);

                setFeaturedBooks(featuredResponse.data.data);
                setNewReleases(newReleasesResponse.data.data);
                setPopularBooks(popularResponse.data.data);
                setCategories(categoriesResponse.data.data);
            } catch (error) {
                setError('Failed to load content. Please try again later.');
                console.error('Error fetching homepage data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomePageData();
    }, []);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="home-container">
            <HeaderComponent />

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading amazing books for you...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <section className="hero-section">
                        <div className="hero-content">
                            <h1>Welcome to BookVerse</h1>
                            <p>Your gateway to endless stories and knowledge</p>
                            {!localStorage.getItem('AT') && (
                                <button onClick={() => navigate('/login')} className="cta-button">
                                    Join Now
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Featured Books Section */}
                    <section className="featured-section">
                        <h2>Featured Books</h2>
                        <div className="books-carousel">
                            {featuredBooks.slice(0, 5).map(book => (
                                <div
                                    key={book.id}
                                    className="featured-book-card"
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
                    </section>

                    {/* Categories Section */}
                    <section className="categories-section">
                        <h2>Explore Categories</h2>
                        <div className="categories-grid">
                            {categories.map(category => (
                                <div
                                    key={category.id}
                                    className="category-card"
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <h3>{category.name}</h3>
                                    <p>{category.book_count} Books</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* New Releases Section */}
                    <section className="new-releases-section">
                        <h2>New Releases</h2>
                        <div className="books-grid">
                            {newReleases.map(book => (
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
                    </section>

                    {/* Popular Books Section */}
                    <section className="popular-section">
                        <h2>Popular Now</h2>
                        <div className="books-grid">
                            {popularBooks.map(book => (
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
                    </section>
                </>
            )}
        </div>
    );
}

export default HomePage;