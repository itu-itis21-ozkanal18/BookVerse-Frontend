import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import '../css/SearchPage.css';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const keyword = searchParams.get('query');

    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [bookLoading, setBookLoading] = useState(false);
    const [authorLoading, setAuthorLoading] = useState(false);
    const [bookError, setBookError] = useState("");
    const [authorError, setAuthorError] = useState("");

    const [bookPage, setBookPage] = useState(1);
    const [authorPage, setAuthorPage] = useState(1);
    const itemsPerPage = 10;

    const fetchBooks = async () => {
        setBookLoading(true);
        setBookError("");
        try {
            const response = await axios.get(`/api/get-book/?s=${encodeURIComponent(keyword)}&limit=20`);
            setBooks(response.data.data);
        } catch (error) {
            setBookError(error.response?.data?.error || "Error fetching books");
        } finally {
            setBookLoading(false);
        }
    };

    const fetchAuthors = async () => {
        setAuthorLoading(true);
        setAuthorError("");
        try {
            const response = await axios.get(`/api/get-author/?s=${encodeURIComponent(keyword)}&limit=20`);
            setAuthors(response.data.data);
        } catch (error) {
            setAuthorError(error.response?.data?.error || "Error fetching authors");
        } finally {
            setAuthorLoading(false);
        }
    };

    useEffect(() => {
        if (keyword) {
            fetchBooks();
        }
    }, [keyword, bookPage]);

    useEffect(() => {
        if (keyword) {
            fetchAuthors();
        }
    }, [keyword, authorPage]);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleAuthorClick = (authorId) => {
        navigate(`/author/${authorId}`);
    };

    return (
        <div>
            <HeaderComponent />
            <div className="search-container">
                <h2 className="search-keyword">Searching for: "{keyword}"</h2>

                <div className="search-section">
                    <h3>Titles:</h3>
                    {bookLoading && <div className="loading-message">Loading books...</div>}
                    {bookError && <div className="error-message">{bookError}</div>}

                    {!bookLoading && !bookError && (
                        <>
                            {books.length > 0 ? (
                                <>
                                    <div className="page-selector">
                                        <button
                                            className="page-button"
                                            disabled={bookPage === 1}
                                            onClick={() => setBookPage(prev => prev - 1)}
                                        >
                                            Previous
                                        </button>
                                        <select
                                            className="page-select"
                                            value={bookPage}
                                            onChange={(e) => setBookPage(Number(e.target.value))}
                                        >
                                            {[...Array(Math.ceil(books.length / itemsPerPage))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    Page {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="page-button"
                                            disabled={bookPage >= Math.ceil(books.length / itemsPerPage)}
                                            onClick={() => setBookPage(prev => prev + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="books-grid">
                                        {books
                                            .slice((bookPage - 1) * itemsPerPage, bookPage * itemsPerPage)
                                            .map((book) => (
                                                <div
                                                    key={book.id}
                                                    className="book-card"
                                                    onClick={() => handleBookClick(book.id)}
                                                >
                                                    <img src={book.cover} alt={book.title} />
                                                    <div className="book-info">
                                                        <span className="book-category">{book.category.name}</span>
                                                        <h4 className="book-title">{book.title}</h4>
                                                        <span className="book-author">{book.author.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <p className="no-results">No books found matching "{keyword}"</p>
                            )}
                        </>
                    )}
                </div>

                {/* Authors Section */}
                <div className="search-section">
                    <h3>Authors:</h3>
                    {authorLoading && <div className="loading-message">Loading authors...</div>}
                    {authorError && <div className="error-message">{authorError}</div>}

                    {!authorLoading && !authorError && (
                        <>
                            {authors.length > 0 ? (
                                <>
                                    <div className="page-selector">
                                        <button
                                            className="page-button"
                                            disabled={authorPage === 1}
                                            onClick={() => setAuthorPage(prev => prev - 1)}
                                        >
                                            Previous
                                        </button>
                                        <select
                                            className="page-select"
                                            value={authorPage}
                                            onChange={(e) => setAuthorPage(Number(e.target.value))}
                                        >
                                            {[...Array(Math.ceil(authors.length / itemsPerPage))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    Page {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="page-button"
                                            disabled={authorPage >= Math.ceil(authors.length / itemsPerPage)}
                                            onClick={() => setAuthorPage(prev => prev + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="books-grid">
                                        {authors
                                            .slice((authorPage - 1) * itemsPerPage, authorPage * itemsPerPage)
                                            .map((author) => (
                                                <div
                                                    key={author.id}
                                                    className="author-card"
                                                    onClick={() => handleAuthorClick(author.id)}
                                                >
                                                    <h3 className="author-title">{author.name}</h3>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <p className="no-results">No authors found matching "{keyword}"</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;