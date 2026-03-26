/* @jsxRuntime classic */
import React from 'react';
import { useState, useEffect } from "react";
import { getUserListings } from "../services/ListingService.js";
import ProductCards from "../components/ProductCards.jsx";
import { Link } from "react-router-dom";
import "../styles/Account.css";

const UserListings = () => {

    // create state to hold user listings in an array
    const [listings, setListings] = useState([]);


    // render user listings once component has rendered
    useEffect(() => {

        // fetchUserListings definition
        // we use async await to pause execution of function until data is fetched by getUserListings()
        // so that code is not blocked waiting for the data
        const fetchUserListings = async () => {
            try {
                //calls function to get user listings from backend using axios rest api
                const response = await getUserListings();

                //the response from the rest api holding the listings data is then given to setListings state variable
                setListings(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching user listings:", error);
            }
        };

        // now call defined function to fetch data for listings
        fetchUserListings();
    }, []);


    // if there are no listings then simply give the message
    if (listings.length === 0) {
        return (
            <div className="acct-empty">
                <i className="bi bi-inbox" />
                <h3>No listings yet</h3>
                <p>You haven't created any listings. Start selling by creating your first listing!</p>
            </div>
        );
    }


    return (
        <div>
            <div className="acct-listings-header">
                <h2>
                    Your Listings
                    <span className="acct-count">
                        {listings.length} {listings.length === 1 ? "listing" : "listings"}
                    </span>
                </h2>
            </div>

            <div className="acct-listings-grid">
                {listings.map((product) => (
                    <Link
                        key={product.id}
                        to={`/item/${product.id}`}
                        style={{ textDecoration: "none" }}
                    >
                        <ProductCards
                            price={`CA ${product.amount || product.price}`}
                            image={
                                (product.imageUrls && product.imageUrls[0]) ||
                                (product.images && product.images[0]) ||
                                product.image
                            }
                            name={product.title || product.name}
                            author={product.author}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UserListings;
