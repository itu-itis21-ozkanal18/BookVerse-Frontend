import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../assets/Logo.png";

function ResetPasswordPage() {
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (passwords.password !== passwords.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`/api/reset-password/${uid}/${token}/`, {
                new_password: passwords.password
            });

            if (response.status === 200) {
                setSuccess(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div>
            <div className="login-page">
                <div className="logo-and-text">
                    <img src={Logo} alt="Logo" className="logo" />
                    <p className="tagline">
                        Reset Your Password
                    </p>
                </div>
                <div className="auth-container">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="New Password"
                            className="login-input"
                            value={passwords.password}
                            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="login-input"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        />
                        <button type="submit" className="login-button">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;