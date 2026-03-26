/* @jsxRuntime classic */
import React from 'react';
import "../styles/Auth.css";
import ufvbaylogo from "../images/ufvbaylogo.png";
import signupimg from "../images/signupimg-Photoroom.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerAPICall } from "../services/AuthService.js";

const Signup = () => {



  // State
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (password === confirmPassword) {
      const userData = {
        username: username,
        name: name,
        email: email,
        // using password state directly fixed the issue previously in login/signup page not wokring so ill leave this comment here
        password: password,
      };

      // snd API call to backend endpoint auth/register
      registerAPICall(userData)
        .then((response) => {

          console.log(response.status, response.data);
          alert("You have successfully created a new account");

          // navigate to login page after successful registration
          navigate("/login");
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          alert("Registration failed. Please try again.");
        });
    } else {
      alert("Passwords do not match. Please re-enter");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-row">
        {/* Form panel */}
        <div className="auth-form-panel">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join UFVBay and start shopping</p>

          <div className="auth-input-row">
            <div className="auth-input-group">
              <i className="bi bi-person auth-input-icon" />
              <input
                type="text"
                className="auth-input"
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <i className="bi bi-at auth-input-icon" />
              <input
                type="text"
                className="auth-input"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <i className="bi bi-envelope auth-input-icon" />
            <input
              type="email"
              className="auth-input"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="auth-input-group">
            <i className="bi bi-shield-lock auth-input-icon" />
            <input
              type="password"
              className="auth-input"
              id="password2"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" onClick={handleSignUp}>
            Sign Up
          </button>

          <p className="auth-link-row">
            Already have an account?{" "}
            <Link to="/login">Log In</Link>
          </p>
        </div>

        {/* Brand panel */}
        <div className="auth-brand-panel">
          <img src={ufvbaylogo} alt="UFVBay logo" className="auth-brand-logo" />
          <h1 className="auth-brand-title">UFVBay</h1>
          <p className="auth-brand-tagline">
            Make an account and start shopping for textbooks for cheap!
          </p>
          <img src={signupimg} alt="UFVBay preview" className="auth-brand-preview" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
