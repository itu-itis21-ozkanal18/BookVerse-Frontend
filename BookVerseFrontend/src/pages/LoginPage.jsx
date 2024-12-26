import React from 'react';
import FooterComponent from '../components/FooterComponent';
import AuthComponent from '../components/AuthComponent';

import '../css/LoginPage.css';
import Logo from "../assets/Logo.png";


function LoginPage() {
    return (
        <div>
            <div className="login-page">
                <div className="logo-and-text">
                    <img src={Logo} alt="Logo" className="logo" />
                    <p className="tagline">
                        Bookverse: Your Destination for Immersive Reading and a Community That Loves to Explore the Pages of Life
                    </p>
                </div>
                <AuthComponent />
            </div>
        </div>

    );
}

export default LoginPage;
