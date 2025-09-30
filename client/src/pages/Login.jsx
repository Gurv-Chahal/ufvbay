import { useState } from "react";
import "../public/Auth.css";
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
    <div className="w-full h-screen d-flex align-items-center justify-content-center">
      <div className="row w-100 vh-100">
        {/*logIn half of auth page */}
        <div className="col-6 border d-flex flex-column justify-content-center">
          <h1 className="text-center" style={{ fontSize: "4rem" }}>
            Sign In
          </h1>
          <div className="my-5">
            <div className="d-flex justify-content-center">
              <input
                type="email"
                className="form-control my-4 py-3 custom-placeholder"
                id="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control py-3"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "600px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid #000",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
          </div>
          {/*Sign Up portion */}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-light-green p-3 rounded-pill"
              onClick={handlelogin}
              style={{
                width: "200px",
                backgroundColor: "#34c759",
                borderColor: "#34c759",
                border: "3px solid #34c759",
                color: "#fff",
              }}
            >
              Log In
            </button>
          </div>

          <div className="d-flex justify-content-center my-2">
            <span style={{ marginRight: "8px" }}>
              <p>Don't have an account?</p>
            </span>

            <Link to="/signup" style={{ textDecoration: "none" }}>
              <span style={{ color: "blue" }}>Create Account</span>
            </Link>
          </div>
        </div>
          <div className="col-6  d-flex flex-column justify-content-center bg-signup">
              <div className="d-flex align-items-center justify-content-center">
                  <img
                      src={ufvbaylogo}
                      alt="logo for UFVBay"
                      style={{width: "120px", height: "auto", marginRight: "10px"}}
                  />
                  <h1
                      className="text-center"
                      style={{color: "#fff", fontSize: "5rem", margin: 0}}
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
                          Welcome back! Checkout the newest listings while you were gone!
                      </h3>
                  </div>
              </div>
              {/* image row */}
              <div className="w-100">
                  <div className="ms-auto pe-4" style={{ width: "78%", maxWidth: 920 }}>
                      <img
                          src={signupimg}
                          alt="UFVBay preview"
                          className="img-fluid d-block"
                          style={{ width: "120%", height: "auto" }}
                      />
                  </div>
              </div>


              {/*Button redirects to signup page*/}
          </div>
      </div>
    </div>
  );
};

export default Auth;
