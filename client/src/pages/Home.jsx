import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import mainimage from "../images/main-image.png";



const Home = () => {

    // state for search bar
    const [filteredItems, setFilteredItems] = useState([]);
    // state to handle subject change
    const [selectedSubject, setSelectedSubject] = useState("");
    const [listings, setListings] = useState([]);

    const navigate = useNavigate()



    // function to handle changes in selected subject
        const handleSubjectChange = (subject) => {
        const normalized = subject === "ALL" ? "" : subject;
        // go to Browse ("/") and let Browse.jsx handle filtering
            navigate("/", { state: { subject: normalized } });
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

    return (
        <div className="home-shell">
            <Navbar onSearch={handleSearch} results={filteredItems} />

            <div className="home-body">
                <div className="home-sidebar">
                    <HomeSideBar onSubjectChange={handleSubjectChange} />
                </div>

                <div className="home-main">
                    <img className="home-hero" src={mainimage} alt="UFVBay" />
                </div>
            </div>
        </div>
    );


export default Home;