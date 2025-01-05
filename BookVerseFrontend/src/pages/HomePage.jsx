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
    const [mostFavorited, setMostFavorited] = useState([]);
    const [popularAuthors, setPopularAuthors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("AT");

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                setLoading(true);
                const [featuredResponse, topRatedResponse, popularResponse, categoriesResponse, mostFavoritedResponse, popularAuthorsResponse] = await Promise.all([
                    axios.get('/api/get-book/?featured=true&limit=5'),
                    axios.get('/api/get-book/?order_rating=true'),
                    token != null ?
                        axios.get('/api/recommended-books/', {
                            headers: { Authorization: `Bearer ${token}` }
                        }) : axios.get('/api/get-book/?featured=true&limit=10'),
                    axios.get('/api/get-categories/'),
                    axios.get('/api/get-book/?order_rating=false&limit=5'),
                    axios.get('/api/get-author/?limit=5&order_fav=true')
                ]);

                setFeaturedBooks(featuredResponse.data.data);
                setNewReleases(topRatedResponse.data.data);
                setPopularBooks(popularResponse.data.data);
                setCategories(categoriesResponse.data.data);
                setMostFavorited(mostFavoritedResponse.data.data);
                setPopularAuthors(popularAuthorsResponse.data.data);
            } catch (error) {
                setError('Failed to load content. Please try again later.');
                console.error('Error fetching homepage data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomePageData();
    }, [token]);

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
                        <div className="hero-flex-container">
                            <div className="hero-content">
                                <h1>Welcome to BookVerse</h1>
                                <p>Your gateway to endless stories and knowledge</p>
                                <div className="hero-buttons">
                                    {!localStorage.getItem('AT') && (
                                        <button onClick={() => navigate('/login')} className="cta-button">
                                            Join Now
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate('/ai-search')}
                                        className="cta-button ai-search-button"
                                    >
                                        Try AI Search
                                    </button>
                                </div>
                            </div>
                            <div className="hero-slider">
                                {featuredBooks.slice(0, 3).map((book, index) => (
                                    <div
                                        key={book.id}
                                        className="hero-slide"
                                        onClick={() => handleBookClick(book.id)}
                                    >
                                        <img src={book.cover} alt={book.title} />
                                        <div className="hero-slide-info">
                                            <h3>{book.title}</h3>
                                            <p>{book.author.name}</p>
                                            <div className="rating">★ {book.average_rating.toFixed(1)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Most Favorited Books Section */}
                    <section className="popular-section">
                        <h2>Popular Books</h2>
                        <div className="books-grid-single-row">
                            {mostFavorited.map(book => (
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
                    </section>

                    {/* Popular Authors Section */}
                    <section className="popular-section">
                        <h2>Popular Authors</h2>
                        <div className="books-grid-single-row">
                            {popularAuthors.map(author => (
                                <div
                                    key={author.id}
                                    className="author-card"
                                    onClick={() => navigate(`/author/${author.id}/?order_fav=true`)}
                                >
                                    <h3 className="author-title">{author.name}</h3>
                                    <p className="author-stats">
                                        {author.book_count} {author.book_count === 1 ? 'Book' : 'Books'} • {author.fav_book_count} {author.fav_book_count === 1 ? 'Favorite' : 'Favorites'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section className="categories-section">
                        <div className="categories-header">
                            <h2>Explore Categories</h2>
                            <button
                                className="view-all-button"
                                onClick={() => navigate('/category/all')}
                            >
                                View All
                            </button>
                        </div>
                        <div className="categories-grid">
                            {categories
                                .sort((a, b) => b.book_count - a.book_count)
                                .slice(0, 8)
                                .map(category => (
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

                    {/* Top Rated Section (previously New Releases) */}
                    <section className="new-releases-section">
                        <h2>Top Rated Books</h2>
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
                                        <div className="rating">★ {book.average_rating.toFixed(1)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Popular Books Section */}
                    {token && (
                        <section className="popular-section">
                            <h2>Recommended For You</h2>
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
                                            <div className="rating">★ {book.average_rating.toFixed(1)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}

export default HomePage;