import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ufvbaylogo from "../images/ufvbaylogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

const Navbar = ({ onSearch, results }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowDropdown(true);
  };

  const handleResultClick = (item) => {
    setShowDropdown(false);
    navigate(`/item/${item.id}`);
  };

  useLayoutEffect(() => {
    const setNavHeight = () => {
      const nav = document.querySelector("nav.navbar.fixed-top");
      if (nav) {
        document.documentElement.style.setProperty(
          "--nav-height",
          `${nav.offsetHeight}px`
        );
      }
    };
    setNavHeight();
    window.addEventListener("resize", setNavHeight);
    return () => window.removeEventListener("resize", setNavHeight);
  }, []);

  return (
    <nav className="navbar fixed-top">
      <div className="nav-inner">
        {/* Brand */}
        <a className="navbar-brand" href="#">
          <img src={ufvbaylogo} alt="UFV Bay Logo" />
          <h2>UFVBay</h2>
        </a>

        {/* Search */}
        <form
          className="search-bar"
          onSubmit={handleSearch}
          ref={dropdownRef}
        >
          <div className="search-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input
              className="form-control"
              type="search"
              placeholder="Search listings..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
          </div>

          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleResultClick(item)}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      {item.amount && (
                        <span
                          className="ms-3"
                          style={{ fontSize: "14px", color: "var(--muted)" }}
                        >
                          ${item.amount}
                        </span>
                      )}
                    </div>
                    {item.imageUrls && item.imageUrls[0] && (
                      <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Theme toggle + Account grouped together */}
        <div className="nav-actions">
          <button
            type="button"
            className="nav-theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
          >
            <i className={theme === "dark" ? "bi bi-sun" : "bi bi-moon"} />
          </button>
          <Link to="/account" className="nav-account-link">
            <i className="bi bi-person"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
