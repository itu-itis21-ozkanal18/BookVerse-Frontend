import React, { useState } from 'react';
import LoginComponent from './LoginComponent';
import SignupComponent from './SignupComponent';
import ForgotPasswordComponent from './ForgotPasswordComponent';

function AuthComponent() {
    const [authMode, setAuthMode] = useState('login');

    return (
        <div className="auth-container">
            {authMode === 'login' && (
                <LoginComponent
                    onSwitchToSignup={() => setAuthMode('signup')}
                    onSwitchToForgot={() => setAuthMode('forgot')}
                />
            )}
            {authMode === 'signup' && (
                <SignupComponent
                    onSwitchToLogin={() => setAuthMode('login')}
                    onSwitchToForgot={() => setAuthMode('forgot')}
                />
            )}
            {authMode === 'forgot' && (
                <ForgotPasswordComponent
                    onSwitchToLogin={() => setAuthMode('login')}
                    onSwitchToSignup={() => setAuthMode('signup')}
                />
            )}
        </div>
    );
}

export default AuthComponent;