import React from 'react';
import HeaderComponent from '../components/HeaderComponent';
import '../css/AboutPage.css';

function AboutPage() {
    return (
        <div>
            <HeaderComponent />
            <div className="about-container">
                <div className="about-content">
                    <h1>About BookVerse</h1>
                    <div className="project-info">
                        <div className="info-section">
                            <h2>Team Name</h2>
                            <p>The Group S</p>
                        </div>
                        <div className="info-section">
                            <h2>Team Members</h2>
                            <ul className="team-list">
                                <li>
                                    <span className="member-name">Yasin Uğurlu</span>
                                    <span className="member-role">Backend - Cloud</span>
                                </li>
                                <li>
                                    <span className="member-name">Mustafa Emre Taflan</span>
                                    <span className="member-role">Backend - Cloud</span>
                                </li>
                                <li>
                                    <span className="member-name">M. Caner Aslan</span>
                                    <span className="member-role">Backend - Cloud</span>
                                </li>
                                <li>
                                    <span className="member-name">Ali Özkan</span>
                                    <span className="member-role">Frontend - Tester</span>
                                </li>
                                <li>
                                    <span className="member-name">Melisa Güler</span>
                                    <span className="member-role">Frontend</span>
                                </li>
                                <li>
                                    <span className="member-name">Arda Ahmet Kanat</span>
                                    <span className="member-role">Frontend</span>
                                </li>
                                <li>
                                    <span className="member-name">Doruk Kurt</span>
                                    <span className="member-role">AI Engineer</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;