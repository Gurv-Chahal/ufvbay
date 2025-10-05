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
        return <div>No user is logged in.</div>;
    }

    return (
        <div className="account-container">
            <header className="account-header">
                <h1>Account Information</h1>
            </header>

            {error && <div className="error-message">{error}</div>}

            {!isEditing ? (
                <div>
                    {/* account detials*/}
                    <div className="account-details">
                        <p>
                            <strong>Name:</strong> {user.name || user.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Username:</strong> {user.username}
                        </p>
                    </div>

                    {/* nav buttons */}
                    <div className="account-actions">
                        <button className="btn btn-primary" onClick={handleEditClick}>
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    {/*edit Form */}
                    <div className="account-details">
                        <div className="form-group">
                            <label htmlFor="name">
                                <strong>Name:</strong>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={updatedUser.name || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <strong>Email:</strong>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={updatedUser.email || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">
                                <strong>Username:</strong>
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={updatedUser.username || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Butons */}
                    <div className="account-actions">
                        <button className="btn btn-primary" onClick={handleSaveClick}>
                            Save
                        </button>
                        <button className="btn btn-primary" onClick={handleCancelClick}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountInfo;
