import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import '../css/ProfilePage.css';

function ProfilePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('favorites');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("AT");

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get('/api/get-user/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUserData(response.data.data);
            } catch (error) {
                setError(error.response?.data?.error || "Error fetching user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token, navigate]);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    return (
        <div>
            <HeaderComponent />
            <div className="profile-container">
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : userData && (
                    <>
                        <div className="profile-header">
                            <h1>{userData.username}'s Profile</h1>
                            <div className="user-info">
                                <p>Member since: {new Date(userData.date_joined).toLocaleDateString()}</p>
                                <p>{userData.email}</p>
                            </div>
                            <div className="user-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{userData.fav_user.length}</span>
                                    <span className="stat-label">Favorites</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{userData.read_user.length}</span>
                                    <span className="stat-label">Reading List</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{userData.rating_user.length}</span>
                                    <span className="stat-label">Ratings</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{userData.comment_user.length}</span>
                                    <span className="stat-label">Reviews</span>
                                </div>
                            </div>

                            <div className="profile-tabs">
                                <button
                                    className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('favorites')}
                                >
                                    Favorites
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'readlist' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('readlist')}
                                >
                                    Reading List
                                </button>
                            </div>
                        </div>

                        <div className="profile-content">
                            {activeTab === 'favorites' ? (
                                <div className="books-section">
                                    <h2>Favorite Books</h2>
                                    {userData.fav_user.length > 0 ? (
                                        <div className="books-grid">
                                            {userData.fav_user.map((fav) => (
                                                <div
                                                    key={fav.id}
                                                    className="book-card"
                                                    onClick={() => handleBookClick(fav.book.id)}
                                                >
                                                    <img src={fav.book.cover} alt={fav.book.title} />
                                                    <div className="book-info">
                                                        <h3>{fav.book.title}</h3>
                                                        <p>{fav.book.page_count} pages</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-books-message">No favorite books yet.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="books-section">
                                    <h2>Reading List</h2>
                                    {userData.read_user.length > 0 ? (
                                        <div className="books-grid">
                                            {userData.read_user.map((read) => (
                                                <div
                                                    key={read.id}
                                                    className="book-card"
                                                    onClick={() => handleBookClick(read.book.id)}
                                                >
                                                    <img src={read.book.cover} alt={read.book.title} />
                                                    <div className="book-info">
                                                        <h3>{read.book.title}</h3>
                                                        <p>{read.book.page_count} pages</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-books-message">No books in reading list.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;