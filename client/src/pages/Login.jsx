/* @jsxRuntime classic */
import React from 'react';
import { useState } from "react";
import "../styles/Auth.css";
import signupimg from "../images/signupimg-Photoroom.png";
import ufvbaylogo from "../images/ufvbaylogo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  loginAPICall,
  saveLoggedInUser,
  storeToken,
  storeUserId,
} from "../services/AuthService.js";

const Auth = () => {


  // state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigator = useNavigate();

  // made it async so that it waits for login api call to finish to make sure everything
  // runs in correct order
  async function handlelogin() {
    // loginAPICall function sends api request to auth/login endpoint in backend
    await loginAPICall(username, password)
      .then((response) => {
        // save JWT token
        let token = response.data.accessToken;
        // save user id
        let userId = response.data.userId;

        // had to do this weird solution because I kept getting error with bearer token not correctly passing ->

        // remove 'Bearer ' from front if it exists
        token = token.replace(/^Bearer\s+/i, "");
        // remove all whitespace characters
        token = token.replace(/\s+/g, "");

        // store token in browser localstorage
        storeToken(token);

        // store userId in localStorage
        storeUserId(userId);

        // store user info in sessionstorage to save the authenticated user state during current session
        saveLoggedInUser(username);

        // go back to home page
        navigator("/");

      })
      .catch((error) => {
        console.log("Login error:", error);
      });
  }

  return (
    <div className="auth-page">
      <div className="auth-row">
        {/* Form panel */}
        <div className="auth-form-panel">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Welcome back to UFVBay</p>

          <div className="auth-input-group">
            <i className="bi bi-envelope auth-input-icon" />
            <input
              type="email"
              className="auth-input"
              id="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <i className="bi bi-lock auth-input-icon" />
            <input
              type="password"
              className="auth-input"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" onClick={handlelogin}>
            Log In
          </button>

          <p className="auth-link-row">
            Don't have an account?{" "}
            <Link to="/signup">Create Account</Link>
          </p>
        </div>

        {/* Brand panel */}
        <div className="auth-brand-panel">
          <img src={ufvbaylogo} alt="UFVBay logo" className="auth-brand-logo" />
          <h1 className="auth-brand-title">UFVBay</h1>
          <p className="auth-brand-tagline">
            Welcome back! Check out the newest listings while you were gone!
          </p>
          <img src={signupimg} alt="UFVBay preview" className="auth-brand-preview" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
