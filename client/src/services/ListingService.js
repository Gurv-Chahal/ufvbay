// Going to use this file to store methods that are going to send api requests to backend for
// basic operations on the website. For example uploading a book.

import axios from "axios";
import { getToken } from "./AuthService.js";


const BASE_REST_API_URL = 'http://localhost:8080';


// interceptor modifies the request before it is sent to the server
axios.interceptors.request.use(
    function (config) {

        // get the token
        const token = getToken();

        // if token exists
        if (token) {
            // set Authorization header to 'Bearer ' + token so that the backend can authenticate the request
            config.headers["Authorization"] = 'Bearer ' + token;

        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);



// Function to get all listings - used in Home.jsx to show all listings
export function getAllListings() {
    return axios.get(`${BASE_REST_API_URL}/api/listings`);
}


// Function to get user-specific listings - used in UserListings.jsx to show specific user listings on profiel
export function getUserListings() {
    return axios.get(`${BASE_REST_API_URL}/api/listings/user`);
}



