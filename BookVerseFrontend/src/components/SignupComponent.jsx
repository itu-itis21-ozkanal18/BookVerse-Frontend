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
    const [isLoading, setIsLoading] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = async () => {
        try {
            if (isLoading) return;

            setError('');
            setSuccess('');
            setIsLoading(true);

            if (!formData.username || !formData.email || !formData.password) {
                setError('All fields are required');
                setIsLoading(false);
                return;
            }

            if (!isValidEmail(formData.email)) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }

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
                setSuccess('Account created successfully! Please check your email to verify your account.');
                setFormData({
                    username: '',
                    email: '',
                    password: ''
                });
            }

        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'Signup failed');
            } else {
                setError('An error occurred during signup');
            }
        } finally {
            setIsLoading(false);
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
            {isLoading && <div className="loading-message">Creating your account...</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    className="signup-input"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={isLoading}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="signup-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="signup-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="signup-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
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
                    disabled={isLoading}
                >
                    Login
                </button>
                <button
                    className="forgot-password-button"
                    onClick={onSwitchToForgot}
                    disabled={isLoading}
                >
                    Forgot Password
                </button>
            </div>
        </div>
    );
}

export default SignupComponent;