// Browse.jsx
/* @jsxRuntime classic */
import React from 'react';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import ProductCards from "../components/ProductCards.jsx";
import { getAllListings } from "../services/ListingService.js";
import "../styles/Home.css";

function formatSubject(subject) {
  if (!subject) return "";
  return subject
    .split(/[\s_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const Browse = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listings, setListings] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    const incoming = location.state?.subject;
    if (typeof incoming === "string") {
      setSelectedSubject(incoming);
    }
  }, [location.state]);

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject === "ALL" ? "" : subject);
  };

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = listings.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredItems(results);
  };

  const fetchListings = () => {
    getAllListings()
      .then((response) => {
        setListings([...response.data]);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  };

  const filteredData = selectedSubject
    ? listings.filter((product) => product.subject === selectedSubject)
    : listings;

  return (
    <div className="home-shell">
      <Navbar onSearch={handleSearch} results={filteredItems} />
      <div className="home-body">
        <div className="home-left">
          <HomeSideBar activeSubject={selectedSubject} onSubjectChange={handleSubjectChange} />
        </div>

        <div className="home-main browse-main">
          {/* Browse header with filter info */}
          <div className="browse-header">
            <div className="browse-meta">
              <h2 className="browse-title">
                {selectedSubject ? formatSubject(selectedSubject) : "All Listings"}
              </h2>
              <span className="browse-count">
                {filteredData.length} {filteredData.length === 1 ? "listing" : "listings"}
              </span>
            </div>
            {selectedSubject && (
              <button
                className="browse-clear-filter"
                onClick={() => setSelectedSubject("")}
              >
                <i className="bi bi-x-circle" /> Clear filter
              </button>
            )}
          </div>

          {/* Listings grid or empty state */}
          {filteredData.length === 0 ? (
            <div className="browse-empty">
              <i className="bi bi-inbox" />
              <h3>No listings found</h3>
              <p>Try selecting a different subject or check back later.</p>
            </div>
          ) : (
            <div className="browse-grid">
              {filteredData.map((product) => {
                const image =
                  (product.imageUrls && product.imageUrls[0]) ||
                  (product.images && product.images[0]) ||
                  product.image;

                return (
                  <Link
                    key={product.id}
                    to={`/item/${product.id}`}
                    state={{ backgroundLocation: location }}
                    style={{ textDecoration: "none" }}
                  >
                    <ProductCards
                      price={`$ ${product.amount || product.price}$`}
                      image={image}
                      name={product.title}
                      subject={product.subject}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
