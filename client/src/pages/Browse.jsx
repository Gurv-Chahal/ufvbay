// Browse.jsx
/* @jsxRuntime classic */
import React from 'react';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import ProductCards from "../components/ProductCards.jsx";
import { getAllListings } from "../services/ListingService.js";




const Browse = () => {


  // state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listings, setListings] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const location = useLocation();






  useEffect(() => {
    // call function to fetch listings from backend
    fetchListings();
  }, []);

  // when arriving from Home, pick up the chosen subject
  useEffect(() => {
    const incoming = location.state?.subject;
    if (typeof incoming === "string") {
      setSelectedSubject(incoming);
    }}, [location.state]);



  // function to handle changes in selected subject
  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject === "ALL" ? "" : subject);
  };


  //handles search queries from user using title and description
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = listings.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    // update state with search results
    setFilteredItems(results);
  };




  // function to fetch all listings from backend
  const fetchListings = () => {

    // calls getAllListings function which sends an api call to backend endpoint
    getAllListings()
      .then((response) => {

        // combine response data into an array using spread operator
        const combinedListings = [...response.data];

        // update state with listing data
        setListings(combinedListings);

      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  };

  // filter listings based on subject
  const filteredData = selectedSubject
      // if selectedSubject is true then filter by selectedSubject
    ? listings.filter((product) => product.subject === selectedSubject)
      // if no subject is selected show all listings
    : listings;



  return (
      <div>
        <Navbar onSearch={handleSearch} results={filteredItems}/>
        {/* was: <div className="d-flex"> */}
        <div className="home-body">
          <div className="home-left">
            <HomeSideBar onSubjectChange={handleSubjectChange}/>
          </div>

          {/* was: ms-auto flex-grow-1 browse-main */}
          <div className="home-main">
            <div className="browse-grid">
              {filteredData.map((product) => {
                const image =
                    (product.imageUrls && product.imageUrls[0]) ||
                    (product.images && product.images[0]) ||
                    product.image;

                return (
                    <div key={product.id} className="m-4">
                      <Link
                          to={`/item/${product.id}`}
                          state={{backgroundLocation: location}}
                          className="prodcards"
                          style={{textDecoration: "none"}}
                      >
                        <ProductCards
                            price={`$ ${product.amount || product.price}$`}
                            image={image}
                            name={product.title}
                            author={product.author}
                        />
                      </Link>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Browse;
