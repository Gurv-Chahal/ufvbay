/* @jsxRuntime classic */
import React from 'react';
import { useState, useEffect } from "react";
import { getUserListings } from "../services/ListingService.js";
import ProductCards from "../components/ProductCards.jsx";
import { Link } from "react-router-dom";
/* @jsxRuntime classic */


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
                setListings(response.data);
            } catch (error) {
                console.error("Error fetching user listings:", error);
            }
        };

        // now call defined function to fetch data for listings
        fetchUserListings();
    }, []);


    // if there are no listings then simply give the message
    if (listings.length === 0) {
        return <div>You have no listings.</div>;
    }


    return (
        <div>
            <h2>Your Listings</h2>
            <br></br>
            <br></br>
            <div className="d-flex flex-wrap">

                {/*iterate over eac listing (state variable) using map*/}
                {listings.map((product) => (

                    // uses product.id as a unique key for each item
                    <div key={product.id} className="m-4">

                        {/*Link sets the url to naviagate to the item detail page*/}
                        <Link to={`/item/${product.id}`}>

                            {/*call product cards component and pass props*/}
                            <ProductCards
                                price={`CA ${product.amount || product.price}`}
                                image={ (product.imageUrls && product.imageUrls[0]) ||
                                    (product.images && product.images[0]) ||
                                    product.image}
                                name={product.title || product.name}
                                author={product.author}
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserListings;
