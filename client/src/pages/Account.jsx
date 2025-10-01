
/* @jsxRuntime classic */
import React from 'react';
import { useState } from "react";
import AccountNavBar from "../components/AccountNavBar.jsx";
import AccountSideBar from "../components/AccountSideBar.jsx";
import AccountInfo from "../components/AccountInfo.jsx";
import UserListings from "../components/UserListings.jsx";

const Account = () => {

    // state keeps track of which tab is currently active, it on default will show account state
    const [activeTab, setActiveTab] = useState("account");

    // updates active tab state when called
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <AccountNavBar />
            <div className="d-flex">
                {/*handleTabChange is passed to AccountSideBar as a prop*/}
                <AccountSideBar onTabChange={handleTabChange} />
                <div className="flex-grow-1" style={{ marginLeft: "400px", padding: "200px" }}>

                    {/*conditionally render content based on activetab value*/}
                    {activeTab === "account" && <AccountInfo />}
                    {activeTab === "listings" && <UserListings />}
                </div>
            </div>
        </div>
    );
};

export default Account;
