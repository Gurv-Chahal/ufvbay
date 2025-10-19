import React from "react";
import { useParams } from "react-router-dom";

export const INFO_SHEETS = {
    explore: {
        title: "How to Explore Listings",
        body: (
            <ol className="tips-list">
                <li>Use the search bar for titles or keywords (e.g., “MATH 141”).</li>
                <li>Filter by subject in the left sidebar to narrow results.</li>
                <li>Open a card to see photos, description, and meet-up info.</li>
                <li>Compare prices across similar listings before messaging.</li>
            </ol>
        ),
    },

    messages: {
        title: "How to Message Sellers",
        body: (
            <ol className="tips-list">
                <li>Open the item and click <em>Message Seller</em>.</li>
                <li>Be clear & respectful; ask about condition and included parts.</li>
                <li>Keep chat in-app; don’t share sensitive personal info.</li>
                <li>Confirm meet place/time on campus and payment method.</li>
            </ol>
        ),
    },

    create: {
        title: "How to Create a Listing",
        body: (
            <ol className="tips-list">
                <li>Take 2–4 clear photos (good light, multiple angles).</li>
                <li>Write a short, searchable title (course code helps).</li>
                <li>Set a fair price after checking recent comps.</li>
                <li>Pick a safe meet spot on campus and add a concise description.</li>
                <li>Upload images and tap <em>Post Listing</em>; manage under <em>Your Listings</em>.</li>
            </ol>
        ),
    },

    safety: {
        title: "Safety Tips",
        body: (
            <ol className="tips-list">
                <li>Meet in busy, well-lit campus spots (Library foyer, Student Union, main entrances).</li>
                <li>Tell a friend where you’re going; bring a buddy if possible.</li>
                <li>Use in-app chat; don’t share sensitive personal info.</li>
                <li>Count cash in public view; consider e-transfer on pickup.</li>
                <li>Inspect items before paying; test electronics briefly.</li>
                <li>Trust your instincts—if it feels off, walk away.</li>
                <li>High value? Meet near campus security, during business hours.</li>
            </ol>
        ),
    },

    "photo-tips": {
        title: "Photo Tips",
        body: (
            <ol className="tips-list">
                <li>Use daylight near a window; avoid harsh overhead lights.</li>
                <li>Shoot multiple angles; include any flaws honestly.</li>
                <li>Clean backgrounds; fill the frame with the item.</li>
                <li>Add a simple size reference (e.g., pen, notebook).</li>
            </ol>
        ),
    },

    pricing: {
        title: "Pricing Tips",
        body: (
            <ol className="tips-list">
                <li>Search recent comps on UFVBay; note sold prices, not asks.</li>
                <li>Round to student-friendly numbers (e.g., $24 vs $25 can help).</li>
                <li>Bundle discounts for multiple items (e.g., “2 for $35”).</li>
            </ol>
        ),
    },
};

export default function InfoSheet({ full = false }) {
    const { slug } = useParams();
    const entry = INFO_SHEETS[slug];

    if (!entry) {
        return (
            <div style={{ padding: 24 }}>
                <h3>Not found</h3>
                <p>This info page doesn’t exist yet.</p>
            </div>
        );
    }

    return full ? (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginTop: 0 }}>{entry.title}</h2>
            <div>{entry.body}</div>
        </div>
    ) : (
        <div>{entry.body}</div>
    );
}
