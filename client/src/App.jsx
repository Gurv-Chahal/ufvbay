
/* @jsxRuntime classic */
import React from 'react';
import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Browse from "./pages/Browse.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Item from "./pages/Item.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Home from "./pages/Home.jsx";

function getInitialTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function AppRoutes() {
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;

    return (
        <>
            {/* Show normal routes OR the background page when we have a modal */}
            <Routes location={backgroundLocation || location}>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Browse />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={<Account />} />
                <Route path="/item/:productId" element={<Item />} />
                <Route path="/create-listing" element={<CreateListing />} />
            </Routes>

            {/* If we came from Browse with state, render Item as an overlay */}
            {backgroundLocation && (
                <Routes>
                    <Route path="/item/:productId" element={<Item asModal={true} />} />
                </Routes>
            )}
        </>
    );
}

export default function App() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <BrowserRouter>
            <AppRoutes />

            {/* Floating theme toggle */}
            <button
                type="button"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                style={{
                    position: "fixed",
                    right: 16,
                    bottom: 16,
                    zIndex: 1000,
                    borderRadius: 999,
                    padding: "8px 12px",
                    border: "1px solid rgba(255,255,255,.2)",
                    background: theme === "dark" ? "#111827" : "#ffffff",
                    color: theme === "dark" ? "#e5e7eb" : "#0f172a",
                    boxShadow: "0 6px 18px rgba(0,0,0,.2)",
                    cursor: "pointer",
                }}
                className="btn btn-sm"
            >
                {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
        </BrowserRouter>
    );
}
