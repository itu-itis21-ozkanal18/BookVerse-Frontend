import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import '../css/ContactPage.css';

function ContactPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("AT");
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/get-user/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data.data);
            } catch (error) {
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please enter your message');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/api/contact-us/', {
                name: userData.username,
                email: userData.email,
                message: message.trim()
            });

            setSuccess(response.data.message);
            setMessage('');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="contact-container">
                <div className="contact-content">
                    <h1>Contact Us</h1>
                    <p className="contact-intro">Have a question or feedback? We'd love to hear from you!</p>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="message-input"
                                rows="6"
                            />
                        </div>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;