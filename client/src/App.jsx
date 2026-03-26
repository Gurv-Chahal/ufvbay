
/* @jsxRuntime classic */
import React from 'react';
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
import SheetModal from "./pages/SheetModal";
import InfoSheet from "./pages/InfoSheet";
import { ThemeProvider } from "./context/ThemeContext";

function AppRoutes() {
    const location = useLocation();
// If the link passed backgroundLocation, use it.
// Otherwise, when we’re on /home/info/*, pretend the background is /home
    const backgroundLocation =
        location.state?.backgroundLocation ||
        (location.pathname.startsWith("/home/info/")
            ? { pathname: "/home" }
            : null);

    React.useEffect(() => {
        const root = document.documentElement;
        const on = !!backgroundLocation;
        root.classList.toggle("modal-open", on);
        return () => root.classList.remove("modal-open");
    }, [backgroundLocation]);

    return (
        <>
            {/* Show normal routes OR the background page when we have a modal */}
            <Routes location={backgroundLocation || location}>
                <Route path="/home" element={<Home />} />
                {/* full-page fallback if URL opened directly */}
                <Route path="/home/info/:slug" element={<InfoSheet full />} />
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
                    <Route path="/home/info/:slug" element={<SheetModal />} />
                    <Route path="/item/:productId" element={<Item asModal={true} />} />
                </Routes>
            )}
        </>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
}
