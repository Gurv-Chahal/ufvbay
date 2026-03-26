/* @jsxRuntime classic */
import React from 'react';

import { useState, useEffect } from "react";
import { getUserInfo, updateUserInfo } from "../services/AuthService.js";
import "../styles/Account.css";

const AccountInfo = () => {

    // State variables
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const [error, setError] = useState(null);



    useEffect(() => {

        //function to fetch user info from backend
        const fetchUserInfo = async () => {
            try {

                // fetch user info using api call
                const userInfo = await getUserInfo();

                // store fetched user info in state
                setUser(userInfo);
                setUpdatedUser(userInfo);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setError("Failed to fetch user information.");
            }
        };
        fetchUserInfo();
    }, []);


    // handles input change in the edit form
    const handleInputChange = (e) => {

        // get the name and value
        const { name, value } = e.target;

        // update state using an object
        setUpdatedUser((prevState) => ({

            // get all the previous state values
            ...prevState,
            // update specific field that is changed
            [name]: value,
        }));
    };


    // handles click on edit button
    const handleEditClick = () => {
        setIsEditing(true);
    };


    // handles click on cancel button and resets state
    const handleCancelClick = () => {
        setIsEditing(false);
        setUpdatedUser(user);
    };


    // handles click for save button
    const handleSaveClick = async () => {
        try {

            //call updateUserInfo in authservice.js and store in variable
            const updatedInfo = await updateUserInfo(updatedUser);

            // update user state
            setUser(updatedInfo);
            // exit edit mode
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating user info:", error);
            setError("Failed to update user information.");
        }
    };


    if (!user) {
        return (
            <div className="acct-empty">
                <i className="bi bi-person-slash" />
                <h3>No user logged in</h3>
                <p>Please log in to view your account information.</p>
            </div>
        );
    }

    return (
        <div className="acct-card">
            <div className="acct-card-header">
                <h2>Account Information</h2>
            </div>

            {error && <div className="acct-error">{error}</div>}

            {!isEditing ? (
                <>
                    <div className="acct-card-body">
                        <div className="acct-field">
                            <span className="acct-field-label">Name</span>
                            <span className="acct-field-value">{user.name || user.username}</span>
                        </div>
                        <div className="acct-field">
                            <span className="acct-field-label">Email</span>
                            <span className="acct-field-value">{user.email}</span>
                        </div>
                        <div className="acct-field">
                            <span className="acct-field-label">Username</span>
                            <span className="acct-field-value">{user.username}</span>
                        </div>
                    </div>

                    <div className="acct-actions">
                        <button className="btn-ufv" onClick={handleEditClick}>
                            Edit Profile
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="acct-card-body">
                        <div className="acct-field">
                            <label className="acct-field-label" htmlFor="name">Name</label>
                            <input
                                className="acct-input"
                                type="text"
                                id="name"
                                name="name"
                                value={updatedUser.name || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="acct-field">
                            <label className="acct-field-label" htmlFor="email">Email</label>
                            <input
                                className="acct-input"
                                type="email"
                                id="email"
                                name="email"
                                value={updatedUser.email || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="acct-field">
                            <label className="acct-field-label" htmlFor="username">Username</label>
                            <input
                                className="acct-input"
                                type="text"
                                id="username"
                                name="username"
                                value={updatedUser.username || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="acct-actions">
                        <button className="btn-ufv" onClick={handleSaveClick}>
                            Save
                        </button>
                        <button className="btn-ufv-outline" onClick={handleCancelClick}>
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AccountInfo;
