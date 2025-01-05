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
    const [bookPagination, setBookPagination] = useState(null);
    const [authorPagination, setAuthorPagination] = useState(null);
    const [currentBookPage, setCurrentBookPage] = useState(1);
    const [currentAuthorPage, setCurrentAuthorPage] = useState(1);

    const limit = 10;

    const fetchBooks = async (page) => {
        setBookLoading(true);
        setBookError("");
        try {
            const offset = (page - 1) * limit;
            const response = await axios.get(
                `/api/get-book/?s=${encodeURIComponent(keyword)}&limit=${limit}&offset=${offset}`
            );
            setBooks(response.data.data);
            setBookPagination(response.data.pagination);
            setCurrentBookPage(page);
        } catch (error) {
            setBookError(error.response?.data?.error || "Error fetching books");
        } finally {
            setBookLoading(false);
        }
    };

    const fetchAuthors = async (page) => {
        setAuthorLoading(true);
        setAuthorError("");
        try {
            const offset = (page - 1) * limit;
            const response = await axios.get(
                `/api/get-author/?s=${encodeURIComponent(keyword)}&limit=${limit}&offset=${offset}`
            );
            setAuthors(response.data.data);
            setAuthorPagination(response.data.pagination);
            setCurrentAuthorPage(page);
        } catch (error) {
            setAuthorError(error.response?.data?.error || "Error fetching authors");
        } finally {
            setAuthorLoading(false);
        }
    };

    useEffect(() => {
        if (keyword) {
            fetchBooks(1);
            fetchAuthors(1);
            setCurrentBookPage(1);
            setCurrentAuthorPage(1);
        }
    }, [keyword]);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleAuthorClick = (authorId) => {
        navigate(`/author/${authorId}`);
    };

    const getTotalPages = (pagination) => {
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
            <div className="search-container">
                <h2 className="search-keyword">Searching for: "{keyword}"</h2>

                {/* Books Section */}
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
                                            disabled={currentBookPage === 1}
                                            onClick={() => fetchBooks(currentBookPage - 1)}
                                        >
                                            Previous
                                        </button>
                                        <select
                                            className="page-select"
                                            value={currentBookPage}
                                            onChange={(e) => fetchBooks(Number(e.target.value))}
                                        >
                                            {renderPageOptions(getTotalPages(bookPagination))}
                                        </select>
                                        <span className="total-pages">
                                            of {getTotalPages(bookPagination)} pages
                                        </span>
                                        <button
                                            className="page-button"
                                            disabled={currentBookPage >= getTotalPages(bookPagination)}
                                            onClick={() => fetchBooks(currentBookPage + 1)}
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
                                            disabled={currentAuthorPage === 1}
                                            onClick={() => fetchAuthors(currentAuthorPage - 1)}
                                        >
                                            Previous
                                        </button>
                                        <select
                                            className="page-select"
                                            value={currentAuthorPage}
                                            onChange={(e) => fetchAuthors(Number(e.target.value))}
                                        >
                                            {renderPageOptions(getTotalPages(authorPagination))}
                                        </select>
                                        <span className="total-pages">
                                            of {getTotalPages(authorPagination)} pages
                                        </span>
                                        <button
                                            className="page-button"
                                            disabled={currentAuthorPage >= getTotalPages(authorPagination)}
                                            onClick={() => fetchAuthors(currentAuthorPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="books-grid">
                                        {authors.map((author) => (
                                            <div
                                                key={author.id}
                                                className="author-card"
                                                onClick={() => handleAuthorClick(author.id)}
                                            >
                                                <h3 className="author-title">{author.name}</h3>
                                                <p className="author-stats">
                                                    {author.book_count} {author.book_count === 1 ? 'Book' : 'Books'} • {author.fav_book_count} {author.fav_book_count === 1 ? 'Favorite' : 'Favorites'}
                                                </p>
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