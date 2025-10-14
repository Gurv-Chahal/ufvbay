import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import mainimage from "../images/main-image.png";
import "../styles/Home.css";




const Home = () => {

    // state for search bar
    const [filteredItems, setFilteredItems] = useState([]);
    // state to handle subject change
    const [selectedSubject, setSelectedSubject] = useState("");
    const [listings, setListings] = useState([]);

    const navigate = useNavigate()

    // typewriting vars
    let i = 0;
    const txt = 'Random text';
    const speed = 50;
    const typingId = useRef(null);     // holds setTimeout id
    const startedRef = useRef(false);  // guards double-run in StrictMode

    // function to handle changes in selected subject
    const handleSubjectChange = (subject) => {
        const normalized = subject === "ALL" ? "" : subject;
        // go to Browse ("/") and let Browse.jsx handle filtering
        navigate("/", {state: {subject: normalized}});
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

    const typeWriter = () => {
        if (i < txt.length) {
            const el = document.getElementById("demo");
            if (!el) return;
            el.textContent += txt.charAt(i);
            i++;
            typingId.current = setTimeout(typeWriter, speed);
        }
    };

    // start once on mount, clean up on unmount
    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;
        const el = document.getElementById("demo");
        if (el) el.textContent = "";
        i = 0;
        typeWriter();
        return () => {
            if (typingId.current) clearTimeout(typingId.current);
        };
    }, []);

    return (
        <div className="home-shell">
            <Navbar onSearch={handleSearch} results={filteredItems}/>

            <div className="home-body">
                <div className="home-sidebar">
                    <HomeSideBar onSubjectChange={handleSubjectChange}/>
                </div>

                <div className="home-main">
                    <img className="home-hero" src={mainimage} alt="UFVBay"/>
                    <p id="demo"></p>
                </div>
            </div>
        </div>
    );
}

export default Home;