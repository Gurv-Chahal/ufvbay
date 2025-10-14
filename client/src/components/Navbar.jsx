import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import ufvbaylogo from "../images/ufvbaylogo.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

//Navbar component
const Navbar = ({ onSearch, results }) => {

  // state
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  // const [showChatRoom, setShowChatRoom] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);


  // use effect is so that clicks outside dropdown menu will close it
  useEffect(() => {

    // event handler for detecting clicks out the dropdown menu
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // add event listen to the DOM
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // remove event listen to the DOM
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // function to handle serach form
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowDropdown(true);
    console.log(searchQuery);
  };


  // function to handle when user clicks on search result
  const handleResultClick = (item) => {
    setShowDropdown(false);
    navigate(`/item/${item.id}`); // ✅ frontend route
  };




  useLayoutEffect(() => {
    const setNavHeight = () => {
      const nav = document.querySelector("nav.navbar.fixed-top");
      if (nav) {
        document.documentElement.style.setProperty(
            "--nav-height",
            `${nav.offsetHeight}px`
        );
      }
    };
    setNavHeight();
    window.addEventListener("resize", setNavHeight);
    return () => window.removeEventListener("resize", setNavHeight);
  }, []);


  return (
      <nav
          className="navbar navbar-light bg-light fixed-top"
          style={{ boxShadow: "none" }}  // bubble will have the shadow
      >
        <div className="container-fluid">

          {/* NEW: bubble wrapper */}
          <div className="nav-bubble">
            <a className="navbar-brand d-flex align-items-center" href="#">
              <img
                  src={ufvbaylogo}
                  className="mx-2"
                  alt="UFV Bay Logo"
                  style={{ width: "42px", height: "42px", marginRight: "10px" }}
              />
              <h2 className="m-0">UFVBay</h2>
            </a>

            {/* Search */}
            <form
                className="d-flex order-1 order-md-0 search-bar position-relative"
                onSubmit={handleSearch}
                ref={dropdownRef}
            >
              <input
                  className="form-control"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
              />
              <button className="btn btn-outline-success" type="submit">
                <i className="bi bi-search"></i>
              </button>

              {/* Dropdown Suggestions */}
              {showDropdown && results.length > 0 && (
                  <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        zIndex: 1050,
                      }}
                  >
                    <ul className="dropdown-menu w-100 show">
                      {results.map((item, index) => (
                          <li
                              key={index}
                              className="dropdown-item"
                              onClick={() => handleResultClick(item)}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                        <span className="me-3" style={{ fontWeight: "bold" }}>
                          {item.title}
                        </span>
                                {item.amount && (
                                    <span className="text-muted" style={{ fontSize: "14px" }}>
                            ${item.amount}
                          </span>
                                )}
                              </div>
                              {item.imageUrls && item.imageUrls[0] && (
                                  <img
                                      src={item.imageUrls[0]}
                                      alt={item.title}
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        marginLeft: "10px",
                                        borderRadius: "5px",
                                      }}
                                  />
                              )}
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </form>

            {/* Right actions */}
            <div className="d-flex order-0 order-md-1">
              <button className="btn border-0" style={{ padding: "10px 14px", border: "none" }}>
                <Link to="/account">
                  <i className="bi bi-person" style={{ fontSize: "30px", color: "black" }}></i>
                </Link>
              </button>
            </div>
          </div>
          {/* /nav-bubble */}
        </div>
      </nav>
  );
};

export default Navbar;
