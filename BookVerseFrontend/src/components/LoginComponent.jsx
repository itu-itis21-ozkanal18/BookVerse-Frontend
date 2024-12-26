import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginComponent({ onSwitchToSignup, onSwitchToForgot }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError("");

            if (!formData.email || !formData.password) {
                setError("All fields are required");
                return;
            }

            const response = await axios.post("/api/login/",
                {
                    email: formData.email,
                    password: formData.password
                });

            if (response.status === 200) {
                localStorage.setItem("RT", response.data.refresh);
                localStorage.setItem("AT", response.data.access);
                localStorage.setItem("UN", response.data.username);
                navigate("/");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="login-box">
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    className="login-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="login-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="divider">
                <hr />
                <span>or</span>
                <hr />
            </div>
            <div className="auth-options">
                <button
                    className="signup-button"
                    onClick={onSwitchToSignup}
                >
                    Sign Up
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

export default LoginComponent;