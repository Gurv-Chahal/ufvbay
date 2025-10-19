import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HomeSideBar from "../components/HomeSideBar.jsx";
import mainimage from "../images/library.jpg";
import secondimage from "../images/books.jpg";
import camera from "../images/camera.jpg";

import "../styles/Home.css";

const Home = () => {
    // search plumbing (unchanged)
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();

    const location = useLocation();

    // ---- slides --------------------------------------------------------------
    // Slide #0 is your current hero. Add/replace slide objects to taste.
// ---- slides --------------------------------------------------------------
    const slides = [
        { key: "hero", kind: "hero" },

        // Slide 2 — same styling as slide 3, unique title + cards
        {
            key: "how",
            kind: "how",
            title: "How UFVBay Works",
            bg: secondimage, // use any image; you can change this later
            items: [
                {
                    h: "Browse Local Listings",
                    p: "Find items posted by UFV students. Filter by subject, category, or price.",
                    cta: "Explore Listings",
                    to: "/home/info/explore",
                },
                {
                    h: "Message Sellers",
                    p: "Chat in-app to ask questions and agree on a fair price—keep it respectful.",
                    cta: "Open Messages",
                    to: "/home/info/messages",

                },
                {
                    h: "Meet On Campus",
                    p: "Pick visible meet-up spots and follow simple safety tips. Students helping students.",
                    cta: "Safety Tips",
                    to: "/home/info/safety",
                },
            ],
        },

        // Slide 3 — same styling, different title + cards
        {
            key: "how2",
            kind: "how",
            title: "Convenient Selling",
            bg: camera, // can be a different photo if you want
            items: [
                {
                    h: "Snap Clear Photos",
                    p: "Good lighting and multiple angles help your listing stand out.",
                    cta: "Photo Tips",
                    to: "/home/info/photo-tips",
                },
                {
                    h: "Price It Smart",
                    p: "Check recent comps on UFVBay and set a fair, student-friendly price.",
                    cta: "See Pricing Tips",
                    to: "/home/info/pricing",
                },
                {
                    h: "Post & Meet",
                    p: "Publish your listing and choose a safe on-campus meet-up spot.",
                    cta: "Create Listing",
                    to: "/home/info/create",

                },
            ],
        },
    ];

    const [index, setIndex] = useState(0);
    const clamp = (i) => Math.max(0, Math.min(i, slides.length - 1));
    const next = () => setIndex((i) => clamp(i + 1));
    const prev = () => setIndex((i) => clamp(i - 1));
    const onKey = (e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
    };





    // ---- existing typewriter for hero only ----------------------------------
    const txt = "Welcome to UFVBay!";
    const speed = 120;
    const loopDelay = 1500;
    const idxRef = useRef(0);
    const timerRef = useRef(null);
    const startedRef = useRef(false);

    const typeWriter = () => {
        const el = document.getElementById("demo");
        if (!el) return;
        if (index !== 0) return; // run only when the hero slide is visible

        if (idxRef.current < txt.length) {
            el.textContent += txt.charAt(idxRef.current);
            idxRef.current += 1;
            timerRef.current = setTimeout(typeWriter, speed);
        } else {
            timerRef.current = setTimeout(() => {
                el.textContent = "";
                idxRef.current = 0;
                typeWriter();
            }, loopDelay);
        }
    };


    // --- typewriter for second slide ("How UFVBay Works")
// --- typewriter for second slide ("How UFVBay Works") — NO LOOP
// Non-looping typewriter for any "how" slide
    const howIdxRef = useRef(0);
    const howTimerRef = useRef(null);

    const typeWriterHow = (el, text, speed) => {
        if (!el) return;
        if (howIdxRef.current < text.length) {
            el.textContent += text.charAt(howIdxRef.current++);
            howTimerRef.current = setTimeout(() => typeWriterHow(el, text, speed), speed);
        } else {
            howTimerRef.current = null; // stop (no loop)
        }
    };





    useEffect(() => {
        // boot once
        if (startedRef.current) return;
        startedRef.current = true;
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        // restart the hero typewriter whenever we return to slide 0
        if (index !== 0) return;
        const el = document.getElementById("demo");
        if (el) el.textContent = "";
        idxRef.current = 0;
        if (timerRef.current) clearTimeout(timerRef.current);
        typeWriter();
    }, [index]);


    useEffect(() => {
        const s = slides[index];
        if (!s || s.kind !== "how") return;

        const el = document.getElementById(`how-typed-${s.key}`);
        if (el) el.textContent = "";
        howIdxRef.current = 0;
        if (howTimerRef.current) clearTimeout(howTimerRef.current);
        typeWriterHow(el, s.title || "", speed);
    }, [index]);




    // subject change from sidebar → go to Browse
    const handleSubjectChange = (subject) => {
        const normalized = subject === "ALL" ? "" : subject;
        navigate("/", { state: { subject: normalized } });
    };

    // (search plumbing you already had)
    const handleSearch = (query) => {
        const q = query.toLowerCase();
        const results = listings.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
        );
        setFilteredItems(results);
    };


    return (
        <div className="home-shell">
            <Navbar onSearch={handleSearch} results={filteredItems} />

            <div className="home-body">
                <div className="home-left">
                    <HomeSideBar onSubjectChange={handleSubjectChange} />
                </div>

                {/* ------- SLIDER LIVES ONLY INSIDE THE MAIN COLUMN ------- */}
                <div className="home-main">
                    <div className="home-slider" aria-roledescription="carousel">
                        <div
                            className="home-track"
                            style={{ transform: `translateX(-${index * 100}%)` }}
                        >
                            {slides.map((s) => (
                                <section className="home-slide" key={s.key}>
                                    {s.kind === "hero" ? (
                                        <div className="home-content">
                                            <img className="home-hero" src={mainimage} alt="UFVBay"/>
                                            <p id="demo" className="typewriter"/>
                                        </div>
                                    ) : s.kind === "how" ? (
                                        // ======== CUSTOM SECOND SLIDE (3 boxes with hover-reveal) ========
                                        // image background + top-aligned content
                                        <div className="home-content panel--how">
                                            <img className="home-hero" src={s.bg || secondimage} alt=""/>
                                            <div className="panel-inner">
                                                <h2 className="panel-title">
                                                    <span id={`how-typed-${s.key}`}></span>
                                                </h2>

                                                <div className="features-grid">
                                                    {(s.items ?? []).map((it, i) => (
                                                        <article className="feature-card" tabIndex="0" key={i}>
                                                            <h3 className="feature-title">{it.h}</h3>
                                                            <p className="feature-text">{it.p}</p>
                                                            <div className="feature-cta">
                                                                {it.to ? (
                                                                    <Link
                                                                        to={it.to}
                                                                      state={{ backgroundLocation: location }}   // <-- shows as modal over Home
                                                                      className="feature-btn"
                                                                    >
                                                                      {it.cta}
                                                                    </Link>
                                                                  ) : (
                                                                    <button className="feature-btn" type="button">{it.cta}</button>
                                                              )}
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // ======== default simple panel (your third slide) ========
                                        <div className="home-content home-content--panel">
                                            <div className="panel-inner">
                                                <h2>{s.title}</h2>
                                                <p>{s.body}</p>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>

                        {/* Controls pinned at bottom center of the main column */}
                        <div className="home-controls" role="group" aria-label="Slides">
                            <button
                                className="nav-btn nav-btn--left"
                                onClick={prev}
                                disabled={index === 0}
                                aria-label="Previous slide"
                            >
                                ‹
                            </button>
                            <button
                                className="nav-btn nav-btn--right"
                                onClick={next}
                                disabled={index === slides.length - 1}
                                aria-label="Next slide"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
                {/* --------------------------------------------------------- */}
            </div>
        </div>
    );
};

export default Home;
