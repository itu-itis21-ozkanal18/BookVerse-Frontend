import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';

import { IoIosStarOutline, IoIosStar, IoIosStarHalf } from "react-icons/io";
import { MdMenuBook, MdFavorite } from "react-icons/md";
import '../css/BookPage.css';

function BookPage() {

    const token = localStorage.getItem("AT");

    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [bookData, setBookData] = useState(null);
    const { bookId } = useParams();
    const [rate, setRate] = useState(0);
    const [tempRate, setTempRate] = useState(0);
    const [defaultRate, setDefaultRate] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [actionStates, setActionStates] = useState({
        favorite: {
            active: false,
            loading: false
        },
        readlist: {
            active: false,
            loading: false
        }
    });

    useEffect(() => {

        const fetchRate = async () => {
            try {
                const response = await axios.get("/api/get-rating/?book_id=" + bookId, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTempRate(response.data.user_rating);
                setDefaultRate(response.data.user_rating);
            } catch (error) {
                console.error("Error fetching book rating:", response.data);
            }
        };

        const fetchBookStatus = async () => {
            if (!token) return;

            try {
                // Fetch both statuses in parallel
                const [favResponse, readlistResponse] = await Promise.all([
                    axios.get(`/api/get-fav/?book_id=${bookId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`/api/get-readlist/?book_id=${bookId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setActionStates({
                    favorite: {
                        active: favResponse.data.data,
                        loading: false
                    },
                    readlist: {
                        active: readlistResponse.data.data,
                        loading: false
                    }
                });
            } catch (error) {
                console.error("Error fetching book status:", error);
            }
        };


        const fetchData = async () => {
            try {
                const response = await axios.get("/api/get-book/?book_id=" + bookId);
                setBookData(response.data.data[0]);
                setRate(response.data.data[0].average_rating.toFixed(1));
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get("/api/get-comment/?book_id=" + bookId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setComments(response.data.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchData();
        fetchRate();
        fetchComments();
        fetchBookStatus();

    }, [bookId, token]);

    const handleFavoriteToggle = async () => {
        try {
            if (!token) {
                setAlertMessage('Please login to add to favorites');
                setShowAlert(true);
                return;
            }

            setActionStates(prev => ({
                ...prev,
                favorite: { ...prev.favorite, loading: true }
            }));

            const response = await axios.post('/api/add-to-fav/',
                { book_id: bookId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                // Update the state based on the response message
                const isNowFavorite = response.data.message.includes('added');
                setActionStates(prev => ({
                    ...prev,
                    favorite: {
                        loading: false,
                        active: isNowFavorite
                    }
                }));
            }

        } catch (error) {
            console.error("Error toggling favorite:", error);
            setActionStates(prev => ({
                ...prev,
                favorite: { ...prev.favorite, loading: false }
            }));
        }
    };

    const handleReadlistToggle = async () => {
        try {
            if (!token) {
                setAlertMessage('Please login to add to reading list');
                setShowAlert(true);
                return;
            }

            setActionStates(prev => ({
                ...prev,
                readlist: { ...prev.readlist, loading: true }
            }));

            const response = await axios.post('/api/add-to-readlist/',
                { book_id: bookId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                // Update the state based on the response message
                const isNowInReadlist = response.data.message.includes('added');
                setActionStates(prev => ({
                    ...prev,
                    readlist: {
                        loading: false,
                        active: isNowInReadlist
                    }
                }));
            }

        } catch (error) {
            console.error("Error toggling readlist:", error);
            setActionStates(prev => ({
                ...prev,
                readlist: { ...prev.readlist, loading: false }
            }));
        }
    };

    const handleRate = async (rate) => {
        try {
            if (!token) {
                setAlertMessage('Please login to rate this book');
                setShowAlert(true);
                return;
            }

            try {
                const response = await axios.post("/api/add-rating/",
                    {
                        book_id: bookData.id,
                        rating: rate
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    setDefaultRate(rate);
                    setTempRate(rate);
                    window.location.reload();
                }
            } catch (error) {
                if (error.response?.status === 400) {
                    const putResponse = await axios.put("/api/add-rating/",
                        {
                            book_id: bookData.id,
                            rating: rate
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (putResponse.status === 200) {
                        setDefaultRate(rate);
                        setTempRate(rate);
                        window.location.reload();
                    }
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error("Error rating book:", error);
            setAlertMessage('Failed to rate book. Please try again.');
            setShowAlert(true);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            if (!token) {
                setAlertMessage('Please login to comment');
                setShowAlert(true);
                return;
            }

            setSubmitLoading(true);
            const postResponse = await axios.post('/api/make-comment/',
                {
                    book_id: bookId,
                    content: newComment
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (postResponse.status === 201) {
                window.location.reload();
            }

        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className='bookpage-container'>
                <div className='bookpage-rows'>
                    <div className='bookpage-rows-left'>
                        <img src={bookData?.cover} alt="Book Cover" />

                        <div className="bookpage-rating-section">
                            <div className="bookpage-rating-title">Rate this book</div>
                            <div className='bookpage-stars-row'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        onMouseEnter={() => setTempRate(star)}
                                        onMouseLeave={() => setTempRate(defaultRate)}
                                    >
                                        {tempRate >= star ? (
                                            <IoIosStar className="bookpage-star" size="1.4vw" />
                                        ) : (
                                            <IoIosStarOutline className="bookpage-star" size="1.4vw" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bookpage-action-buttons">
                            <button
                                className={`bookpage-action-button favorite-button ${actionStates.favorite.active ? 'active' : ''}`}
                                onClick={handleFavoriteToggle}
                                disabled={actionStates.favorite.loading}
                            >
                                <MdFavorite size="1.4vw" />
                                <span>
                                    {actionStates.favorite.loading ? 'Loading...' :
                                        actionStates.favorite.active ? 'Remove from Favorites' : 'Add to Favorites'}
                                </span>
                            </button>
                            <button
                                className={`bookpage-action-button readlist-button ${actionStates.readlist.active ? 'active' : ''}`}
                                onClick={handleReadlistToggle}
                                disabled={actionStates.readlist.loading}
                            >
                                <MdMenuBook size="1.4vw" />
                                <span>
                                    {actionStates.readlist.loading ? 'Loading...' :
                                        actionStates.readlist.active ? 'Remove from Readlist' : 'Add to Readlist'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className='bookpage-rows-right'>
                        <div className="book-details">
                            <h1 className="book-title">{bookData?.title}</h1>
                            <div
                                className="book-author"
                                onClick={() => navigate(`/author/${bookData?.author.id}`)}
                            >
                                By {bookData?.author.name}
                            </div>
                            <div className="book-rating">
                                <div className="average-rating">
                                    <span className="rating-number">{rate}</span>
                                    <div className='bookpage-stars-row'>
                                        {[...Array(5)].map((_, index) => {
                                            const starValue = index + 1;
                                            if (rate >= starValue) {
                                                return <IoIosStar key={index} size={"1.4vw"} />;
                                            } else if (rate >= starValue - 0.5) {
                                                return <IoIosStarHalf key={index} size={"1.4vw"} />;
                                            } else {
                                                return <IoIosStarOutline key={index} size={"1.4vw"} />;
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="book-category">
                                Category: <span>{bookData?.category.name}</span>
                            </div>
                            <div className="book-pages">
                                Pages: <span>{bookData?.page_count}</span>
                            </div>
                            <div className="book-summary-title">Summary</div>
                            <p className="book-summary">{bookData?.summary}</p>
                        </div>
                    </div>
                </div>
                {(
                    <div className='bookpage-comments-section'>
                        <h2>Comments</h2>
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="comment-input"
                            />
                            <button
                                type="submit"
                                className="comment-submit"
                                disabled={submitLoading}
                            >
                                {submitLoading ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>
                        {comments.length > 0 && <div className="comments-list">
                            {comments.map((comment) => (
                                <div className="comment-card" key={comment.id}>
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.user.username}</span>
                                        <span className="comment-date">
                                            {new Date(comment.date).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="comment-content">{comment.content}</p>
                                </div>
                            ))}
                        </div>}
                    </div>
                )}
                <div className='bookpage-comments'>

                </div>
            </div>
            {showAlert && (
                <div className="alert-overlay">
                    <p className="alert-message">{alertMessage}</p>
                    <button
                        className="alert-button"
                        onClick={() => setShowAlert(false)}
                    >
                        OK
                    </button>
                </div>
            )}
        </div>
    )
}

export default BookPage