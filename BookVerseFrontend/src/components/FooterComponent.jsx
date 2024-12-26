import React from "react";
import "../css/FooterComponent.css";

import Logo from "../assets/Logo.png";
import GoogleIcon from "../assets/google-icon.png";
import TwitterIcon from "../assets/twitter-icon.png";

function FooterComponent() {
  return (
    <div className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <img src={Logo} alt="BookVerse Logo" />
          <h1>BookVerse</h1>
        </div>

        {/* Center Section */}
        <div className="footer-center">
          <button>BookVerse PRO</button>
          <a href="/about-us">ABOUT US</a>
          <a href="/contact">CONTACT US</a>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <a href="https://google.com" target="_blank" rel="noreferrer">
            <img src={GoogleIcon} alt="Google" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src={TwitterIcon} alt="Twitter" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 BookVerse. All rights reserved.
      </div>
    </div>
  );
}

export default FooterComponent;
