import React, { useState } from 'react';
import axios from 'axios';

function ForgotPasswordComponent({ onSwitchToLogin, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("/api/request-reset-password/",
                { email: email }
            );

            if (response.status === 201) {
                setSuccess(response.data.message);
                setEmail("");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    }

    return (
        <div className="forgot-password-box">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleForgotPassword}>
                <input
                    type="email"
                    placeholder="Email"
                    className="forgot-password-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="forgot-password-button">
                    Reset Password
                </button>
            </form>
            <div className="divider">
                <hr />
                <span>or</span>
                <hr />
            </div>
            <div className="auth-options">
                <button className="login-button" onClick={onSwitchToLogin}>
                    Login
                </button>
                <button className="signup-button" onClick={onSwitchToSignup}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default ForgotPasswordComponent;