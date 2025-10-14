import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import mainimage from "../images/library.jpg";
import "../styles/Home.css";




const Home = () => {

    // state for search bar
    const [filteredItems, setFilteredItems] = useState([]);
    // state to handle subject change
    const [selectedSubject, setSelectedSubject] = useState("");
    const [listings, setListings] = useState([]);

    const navigate = useNavigate()

    // typewriter config/refs
    const txt = "Welcome to UFVBay!";
    const speed = 300;         // ms per character
    const loopDelay = 800;    // pause before restarting
    const idxRef = useRef(0); // current character index
    const timerRef = useRef(null);
    const startedRef = useRef(false);

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

    // typewriter loop
    const typeWriter = () => {
        const el = document.getElementById("demo");
        if (!el) return;

        if (idxRef.current < txt.length) {
            el.textContent += txt.charAt(idxRef.current);
            idxRef.current += 1;
            timerRef.current = setTimeout(typeWriter, speed);
        } else {
            // finished one pass — wait, clear, restart
            timerRef.current = setTimeout(() => {
                el.textContent = "";
                idxRef.current = 0;
                typeWriter();
            }, loopDelay);
        }
    };

    // start once on mount, clean up on unmount
    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const el = document.getElementById("demo");
        if (el) el.textContent = "";
        idxRef.current = 0;
        typeWriter();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
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
                    <div className="home-content">
                    <img className="home-hero" src={mainimage} alt="UFVBay"/>
                    <p id="demo" className='typewriter'></p>
                    </div>
                </div>

                <div className='home-second'>
                    {/*<h2>How UFVBay works</h2>*/}

                </div>
            </div>
        </div>
    );
}

export default Home;