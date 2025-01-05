import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/VerifyEmailPage.css';
import Logo from "../assets/Logo.png";

function VerifyEmailPage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (!uid || !token) {
                    setStatus('error');
                    return;
                }

                const response = await axios.get(`/api/verify-email/${uid}/${token}/`);
                if (response.status === 200) {
                    setStatus('success');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            } catch (error) {
                setStatus('error');
            }
        };

        verifyEmail();
    }, [uid, token, navigate]);

    const getStatusMessage = () => {
        switch (status) {
            case 'verifying':
                return 'Verifying your email...';
            case 'success':
                return 'Email verified successfully! Redirecting to login...';
            case 'error':
                return 'Failed to verify email. The link may be invalid or expired.';
            default:
                return '';
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-box">
                <img
                    src={Logo}
                    alt="BookVerse Logo"
                    className="verify-logo"
                    onClick={() => navigate('/')}
                />
                <div className={`verify-message ${status}`}>
                    {getStatusMessage()}
                </div>
                {status === 'error' && (
                    <div className="verify-actions">
                        <button
                            className="verify-button"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyEmailPage;