/* @jsxRuntime classic */
import React from 'react';
import "../styles/HomeSideBar.css";
import { Link, useNavigate } from "react-router-dom";
import { isUserLoggedIn, logout } from "../services/AuthService.js";

const SUBJECTS = [
  "MATH",
  "PHYSICS",
  "COMPUTER SCIENCE",
  "BIOLOGY",
  "CHEMISTRY",
  "ENGLISH",
  "HISTORY",
  "ECONOMICS",
  "PSYCHOLOGY",
  "ENGINEERING",
  "BUSINESS",
  "STATISTICS",
  "PHILOSOPHY",
];

function formatSubject(subject) {
  return subject
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const HomeSideBar = ({ activeSubject = "", onSubjectChange }) => {
  const [isAuth, setIsAuth] = React.useState(isUserLoggedIn());
  const navigate = useNavigate();

  React.useEffect(() => {
    const refresh = () => setIsAuth(isUserLoggedIn());
    window.addEventListener('auth-changed', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('auth-changed', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  function handleLogout(e) {
    e.preventDefault();
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="home-sidebar">
      {/* Create Listing CTA */}
      <Link to="/create-listing" className="sidebar-cta">
        <i className="bi bi-plus-circle-dotted" />
        Create Listing
      </Link>

      <div className="sidebar-divider" />

      {/* Nav items */}
      <Link to="/home" className="sidebar-item">
        <i className="bi bi-house" />
        Home
      </Link>

      <button className="sidebar-item" onClick={() => onSubjectChange("ALL")}>
        <i className="bi bi-bag" />
        Browse
      </button>

      <div className="sidebar-subjects-wrap">
        <p className="sidebar-section-label">Subjects</p>
        <div className="sidebar-subjects">
          <button
            className={`sidebar-item sidebar-subject ${!activeSubject ? "is-active" : ""}`.trim()}
            onClick={() => onSubjectChange("ALL")}
            type="button"
          >
            <i className="bi bi-grid" />
            All Subjects
          </button>

          {SUBJECTS.map((subject) => (
            <button
              className={`sidebar-item sidebar-subject ${activeSubject === subject ? "is-active" : ""}`.trim()}
              key={subject}
              onClick={() => onSubjectChange(subject)}
              type="button"
            >
              <i className="bi bi-book" />
              {formatSubject(subject)}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-divider" />

        {!isAuth && (
          <Link to="/login" className="sidebar-item">
            <i className="bi bi-box-arrow-in-right" />
            Log In
          </Link>
        )}

        {isAuth && (
          <button onClick={handleLogout} className="sidebar-item">
            <i className="bi bi-box-arrow-right" />
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeSideBar;
