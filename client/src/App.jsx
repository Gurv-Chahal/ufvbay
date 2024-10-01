import { useState } from "react";
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import Auth from "./pages/Auth.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
