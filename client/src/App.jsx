import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Item from "./pages/Item.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/item/:productId" element={<Item />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Routes>

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
