import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import '../css/AuthorPage.css';

function AuthorPage() {
    const { authorId } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                setLoading(true);
                setError("");

                const authorResponse = await axios.get(`/api/get-author/?id=${authorId}`);
                const authorData = authorResponse.data.data[0];
                setAuthor(authorData);
                setBooks(authorData.book_books || []);
            } catch (error) {
                setError("Author not found");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorData();
    }, [authorId]);

    return (
        <div>
            <HeaderComponent />
            <div className="author-container">
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : author ? (
                    <>
                        <div className="author-header">
                            <div className="author-info">
                                <h1>{author.name}</h1>
                            </div>
                            <div className="author-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{author.book_count}</span>
                                    <span className="stat-label">Books</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{author.average_rating?.toFixed(1) || '0.0'}</span>
                                    <span className="stat-label">Avg Rating</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{author.fav_book_count}</span>
                                    <span className="stat-label">Favorites</span>
                                </div>
                            </div>
                        </div>

                        <div className="author-books">
                            <h2>Books by {author.name}</h2>
                            {books.length === 0 ? (
                                <div className="no-books-message">
                                    There are no books from {author.name}
                                </div>
                            ) : (
                                <div className="books-grid">
                                    {books.map((book) => (
                                        <div
                                            key={book.id}
                                            className="book-card"
                                            onClick={() => navigate(`/book/${book.id}`)}
                                        >
                                            <img src={book.cover} alt={book.title} />
                                            <div className="book-info">
                                                <h3>{book.title}</h3>
                                                <div className="rating">★ {book.average_rating?.toFixed(1) || '0.0'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default AuthorPage;