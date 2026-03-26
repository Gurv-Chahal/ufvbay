
/* @jsxRuntime classic */
import React from 'react';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import AccountInfo from "../components/AccountInfo.jsx";
import UserListings from "../components/UserListings.jsx";
import { logout } from "../services/AuthService.js";
import { getAllListings } from "../services/ListingService.js";
import "../styles/HomeSideBar.css";
import "../styles/Home.css";
import "../styles/Account.css";

const Account = () => {
    const [activeTab, setActiveTab] = useState("account");
    const [filteredItems, setFilteredItems] = useState([]);
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleSearch = (query) => {
        getAllListings()
            .then((response) => {
                const lowerCaseQuery = query.toLowerCase();
                const results = response.data.filter(
                    (item) =>
                        item.title.toLowerCase().includes(lowerCaseQuery) ||
                        item.description.toLowerCase().includes(lowerCaseQuery)
                );
                setFilteredItems(results);
            })
            .catch((error) => {
                console.error("Error searching:", error);
            });
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="home-shell">
            <Navbar onSearch={handleSearch} results={filteredItems} />
            <div className="home-body">
                {/* Sidebar using existing HomeSideBar.css classes */}
                <div className="home-left">
                    <aside className="home-sidebar">
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <button className="sidebar-cta">
                                <i className="bi bi-arrow-left" />
                                Back to Browse
                            </button>
                        </Link>

                        <hr className="sidebar-divider" />

                        <button
                            className={`sidebar-item ${activeTab === "account" ? "is-active" : ""}`}
                            onClick={() => handleTabChange("account")}
                        >
                            <i className="bi bi-person" />
                            Account
                        </button>

                        <button
                            className={`sidebar-item ${activeTab === "listings" ? "is-active" : ""}`}
                            onClick={() => handleTabChange("listings")}
                        >
                            <i className="bi bi-grid" />
                            Your Listings
                        </button>

                        <hr className="sidebar-divider" />

                        <button
                            className="sidebar-item"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-left" />
                            Log Out
                        </button>
                    </aside>
                </div>

                {/* Main content */}
                <div className="home-main">
                    {activeTab === "account" && <AccountInfo />}
                    {activeTab === "listings" && <UserListings />}
                </div>
            </div>
        </div>
    );
};

export default Account;
