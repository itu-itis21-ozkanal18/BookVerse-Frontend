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

                // Fetch author details and their books
                const [authorResponse, booksResponse] = await Promise.all([
                    axios.get(`/api/get-author/?author_id=${authorId}`),
                    axios.get(`/api/get-book/?author_id=${authorId}`)
                ]);

                setAuthor(authorResponse.data.data[0]);
                setBooks(booksResponse.data.data);
            } catch (error) {
                setError(error.response?.data?.error || "Error fetching author data");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorData();
    }, [authorId]);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

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
                                <p className="author-bio">{author.bio}</p>
                            </div>
                            <div className="author-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{books.length}</span>
                                    <span className="stat-label">Books</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {(books.reduce((acc, book) => acc + book.average_rating, 0) / books.length || 0).toFixed(1)}
                                    </span>
                                    <span className="stat-label">Avg Rating</span>
                                </div>
                            </div>
                        </div>

                        <div className="author-books">
                            <h2>Books by {author.name}</h2>
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
                                            <div className="rating">★ {book.average_rating.toFixed(1)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="error-message">Author not found</div>
                )}
            </div>
        </div>
    );
}

export default AuthorPage;