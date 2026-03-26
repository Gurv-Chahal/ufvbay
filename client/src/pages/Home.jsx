import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import ProductCards from "../components/ProductCards.jsx";
import { getAllListings } from "../services/ListingService.js";

import "../styles/Home.css";

const Home = () => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Subject change from sidebar → go to Browse
  const handleSubjectChange = (subject) => {
    const normalized = subject === "ALL" ? "" : subject;
    navigate("/", { state: { subject: normalized } });
  };

  // Load listings for search + featured section
  useEffect(() => {
    getAllListings()
      .then(({ data }) => setListings([...data]))
      .catch((err) => console.error("Error fetching listings:", err));
  }, []);

  // Search handler for Navbar
  const handleSearch = (query) => {
    const q = (query || "").trim().toLowerCase();
    if (!q) {
      setFilteredItems([]);
      return;
    }
    const results = listings.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q)
    );
    setFilteredItems(results);
  };

  // Get up to 4 images for the hero preview
  const previewListings = listings.slice(0, 4);

  return (
    <div className="home-shell">
      <Navbar onSearch={handleSearch} results={filteredItems} />

      <div className="home-body">
        <div className="home-left">
          <HomeSideBar onSubjectChange={handleSubjectChange} />
        </div>

        <div className="home-main">
          {/* ---- Hero Section (two-column) ---- */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Buy &amp; sell textbooks at UFV
              </h1>
              <p className="hero-subtitle">
                The student marketplace for University of the Fraser Valley.
                Find what you need, sell what you don't.
              </p>
              <div className="hero-actions">
                <Link to="/" className="hero-btn-primary">
                  Browse Listings
                </Link>
                <Link to="/create-listing" className="hero-btn-secondary">
                  Start Selling
                </Link>
              </div>
            </div>

            <div className="hero-preview">
              {previewListings.length > 0
                ? previewListings.map((item) => {
                    const img =
                      (item.imageUrls && item.imageUrls[0]) ||
                      (item.images && item.images[0]) ||
                      item.image;
                    return img ? (
                      <img key={item.id} src={img} alt={item.title || ""} />
                    ) : (
                      <div key={item.id} className="hero-preview-placeholder" />
                    );
                  })
                : Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="hero-preview-placeholder" />
                  ))}
            </div>
          </section>

          {/* ---- Recently Posted ---- */}
          {listings.length > 0 && (
            <section className="featured-section">
              <div className="section-header">
                <h2>Recently Posted</h2>
                <Link to="/" className="view-all-link">
                  View All <i className="bi bi-arrow-right" />
                </Link>
              </div>
              <div className="featured-grid">
                {listings.slice(0, 8).map((product) => {
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
            </section>
          )}

          {/* ---- How It Works ---- */}
          <section className="how-section">
            <p className="how-eyebrow">How It Works</p>
            <h2 className="how-heading">Three simple steps</h2>

            <div className="how-grid">
              <Link
                to="/home/info/explore"
                state={{ backgroundLocation: location }}
                className="how-card"
              >
                <div className="step-number">1</div>
                <h3>Browse Local Listings</h3>
                <p>
                  Find items posted by UFV students. Filter by subject,
                  category, or price.
                </p>
              </Link>

              <Link
                to="/home/info/messages"
                state={{ backgroundLocation: location }}
                className="how-card"
              >
                <div className="step-number">2</div>
                <h3>Message Sellers</h3>
                <p>
                  Chat in-app to ask questions and agree on a fair
                  price — keep it respectful.
                </p>
              </Link>

              <Link
                to="/home/info/safety"
                state={{ backgroundLocation: location }}
                className="how-card"
              >
                <div className="step-number">3</div>
                <h3>Meet On Campus</h3>
                <p>
                  Pick visible meet-up spots and follow simple safety tips.
                  Students helping students.
                </p>
              </Link>
            </div>
          </section>

          {/* ---- Community Stats ---- */}
          <section className="stats-bar">
            <div className="stat-card">
              <div className="stat-number">{listings.length}</div>
              <div className="stat-label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">13</div>
              <div className="stat-label">Subjects Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                <i className="bi bi-shield-check" />
              </div>
              <div className="stat-label">UFV Students Only</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
