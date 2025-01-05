import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import '../css/AISearchPage.css';

function AISearchPage() {
    const [searchInput, setSearchInput] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchInput.trim()) {
            setError('Please enter a story or description');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/api/semantic-search/', {
                key: searchInput
            });

            if (response.data.status === 'success') {
                setBooks(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to search books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    return (
        <div className="ai-search-container">
            <HeaderComponent />

            <div className="ai-search-content">
                <div className="ai-search-header">
                    <h1>AI Book Search</h1>
                    <p>Describe a story or theme, and we'll find the perfect books for you</p>
                </div>

                <div className="search-box">
                    <textarea
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Enter a story description or theme (e.g., 'A story about time travel and love' or 'A mystery set in Victorian London')"
                        className="search-input"
                    />
                    <button
                        onClick={handleSearch}
                        className="search-button"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Find Books'}
                    </button>
                </div>

                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                        <button onClick={() => setError('')}>Try Again</button>
                    </div>
                )}

                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Finding the perfect books for you...</p>
                    </div>
                )}

                {!loading && books.length > 0 && (
                    <div className="results-section">
                        <h2>Discovered Books</h2>
                        <div className="books-grid">
                            {books.map(book => (
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
                    </div>
                )}
            </div>
        </div>
    );
}

export default AISearchPage;