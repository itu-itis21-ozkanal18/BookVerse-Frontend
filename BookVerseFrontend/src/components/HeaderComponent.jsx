import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Logo from "../assets/Logo.png";
import "../css/HeaderComponent.css";
import { useNavigate } from 'react-router-dom';

import { IoSearch } from "react-icons/io5";

const HeaderComponent = () => {
    const [categories, setCategories] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/api/get-categories/");
                const categories = response.data.data.filter((cat) => cat.book_count > 0);
                setCategories(categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleCategoryClick = (category) => {
        if (category === "All") {
            navigate('/category/all');
        } else {
            navigate(`/category/${category.id}`);
        }
        setDropdownOpen(false);
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header__logo" onClick={handleLogoClick}>
                <img src={Logo} alt="BookVerse Logo" className="header__logo-image" />
                <h1 className="header__title">BookVerse</h1>
            </div>
            <div className="header__search">
                <form onSubmit={handleSearch} className="header__search-form">
                    <input
                        type="text"
                        placeholder="Search"
                        className="header__search-bar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="header__search-button">
                        <IoSearch />
                    </button>
                </form>
            </div>
            <div className="header__categories">
                <div
                    className="header__categories-title"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    Categories ▼
                    <div style={{ display: dropdownOpen ? "flex" : "none" }}>
                        <ul className="header__categories-dropdown" ref={dropdownRef}>
                            <li onClick={() => handleCategoryClick("All")}>All</li>
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)} // Pass the entire category object
                                >
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header__buttons">
                <button className="header__pro-button">BookVerse PRO</button>
                {localStorage.getItem("AT") ? (
                    <div className="header__user-info">
                        <span
                            className="header__username"
                            onClick={() => navigate('/profile')}
                        >
                            {localStorage.getItem("UN")}
                        </span>
                        <button
                            className="header__logout-button"
                            onClick={() => {
                                localStorage.removeItem("AT");
                                localStorage.removeItem("RT");
                                localStorage.removeItem("UN");
                                navigate('/');
                            }}
                        >
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    <button
                        className="header__login-button"
                        onClick={() => navigate('/login')}
                    >
                        LOGIN
                    </button>
                )}
            </div>
        </header>
    );
};

export default HeaderComponent;