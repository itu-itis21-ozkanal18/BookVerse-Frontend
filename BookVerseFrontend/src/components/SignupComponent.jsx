import React, { useState } from 'react';
import axios from 'axios';

function SignupComponent({ onSwitchToLogin, onSwitchToForgot }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Basic email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = async () => {
        try {
            // Reset messages
            setError('');
            setSuccess('');

            // Form validation
            if (!formData.username || !formData.email || !formData.password) {
                setError('All fields are required');
                return;
            }

            if (!isValidEmail(formData.email)) {
                setError('Please enter a valid email address');
                return;
            }

            // Create form data
            const formBody = new URLSearchParams();
            formBody.append('username', formData.username);
            formBody.append('email', formData.email);
            formBody.append('password', formData.password);

            const response = await axios.post('/api/signup/', formBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.status === 201) {
                setSuccess(response.data.message);
                // Clear form
                setFormData({
                    username: '',
                    email: '',
                    password: ''
                });
                // Optionally redirect to login after a delay
                setTimeout(() => {
                    onSwitchToLogin();
                }, 3000);
            }

        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'Signup failed');
            } else {
                setError('An error occurred during signup');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSignup();
    }

    return (
        <div className="signup-box">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    className="signup-input"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="signup-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="signup-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            <div className="divider">
                <hr />
                <span>or</span>
                <hr />
            </div>
            <div className="auth-options">
                <button
                    className="login-button"
                    onClick={onSwitchToLogin}
                >
                    Login
                </button>
                <button
                    className="forgot-password-button"
                    onClick={onSwitchToForgot}
                >
                    Forgot Password
                </button>
            </div>
        </div>
    );
}

export default SignupComponent;