/* @jsxRuntime classic */
import React from 'react';

import ufvbaylogo from "../images/ufvbaylogo.png";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

//Navbar component
const AccountNavBar = () => {
  return (
    <nav
      //Sets nav bar colour and makes it appear above homeside navbar
      className="navbar navbar-light bg-light fixed-top"
      style={{ zIndex: 1200, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand d-flex" href="#">
          <img
            src={ufvbaylogo}
            className="mx-2"
            alt="UFV Bay Logo"
            style={{ width: "50px", height: "50px", marginRight: "12px" }}
          />
          <h2 className="py-2">UFVBay</h2>
        </a>

        <div className="d-flex order-0 order-md-1">
          {/*Message button*/}
          {/*<button */}
          {/*  className="btn border-0"*/}
          {/*  style={{ padding: "15px 20px", border: "none" }}*/}
          {/*>*/}
          {/*  <i className="bi bi-chat-left" style={{ fontSize: "32px" }}></i>*/}
          {/*</button>*/}
          {/*Account Button*/}
          <button
            className="btn border-0"
            style={{ padding: "15px 20px", border: "none" }}
          >
            {" "}
            <Link to="/account">
              <i
                className="bi bi-person"
                style={{ fontSize: "35px", color: "black" }}
              ></i>
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AccountNavBar;
