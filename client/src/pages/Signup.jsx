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
    <div className="w-full h-screen d-flex align-items-center justify-content-center">
      <div className="row w-100 vh-100">
        {/* Create account portion of the page */}
        <div className="col-6 border d-flex flex-column justify-content-center">
          <h1 className="text-center" style={{ fontSize: "4rem" }}>
            Create an Account
          </h1>
          <div className="my-5">
            <div className="d-flex justify-content-center">
              <div className="d-flex" style={{ width: "600px" }}>
                <input
                  type="text"
                  className="form-control my-3 py-3 custom-placeholder"
                  id="name"
                  placeholder="Enter your Name"
                  style={{
                    width: "50%",
                    marginRight: "10px",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "2px solid #000",
                    backgroundColor: "#f0f0f0",
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control my-3 py-3 custom-placeholder"
                  id="username"
                  placeholder="Enter a Username"
                  style={{
                    width: "50%",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "2px solid #000",
                    backgroundColor: "#f0f0f0",
                  }}
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <input
                type="email"
                className="form-control my-3 py-3 custom-placeholder"
                id="email"
                placeholder="Enter your email"
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control py-3"
                id="password"
                placeholder="Enter your password"
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control py-3"
                id="password2"
                placeholder="Re-enter your password"
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {/* Right half of the webpage for logging in if you have an account */}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-light-green p-3 rounded-pill"
              style={{
                width: "200px",
                backgroundColor: "#34c759",
                borderColor: "#34c759",
                border: "3px solid #34c759",
                color: "#fff",
              }}
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
          <div className="d-flex justify-content-center my-2">
            <span style={{ marginRight: "8px" }}>
              <p>Already have an account?</p>
            </span>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <span style={{ color: "blue" }}>Log In</span>
            </Link>
          </div>
        </div>
        <div className="col-6  d-flex flex-column justify-content-center bg-signup">
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={ufvbaylogo}
              alt="logo for UFVBay"
              style={{ width: "120px", height: "auto", marginRight: "10px" }}
            />
            <h1
              className="text-center"
              style={{ color: "#fff", fontSize: "5rem", margin: 0 }}
            >
              UFVBay
            </h1>
          </div>
          <div className="my-5">
            <div className="d-flex justify-content-center">
              <h3
                className="text-center "
                style={{
                  color: "#fff",
                  fontSize: "2rem",
                  width: "800px",
                }}
              >
                Make an account and start shopping for textbooks for cheap!
              </h3>
            </div>
          </div>
          <img src={signupimg} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
