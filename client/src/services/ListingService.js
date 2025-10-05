// ListingService.js
// Basic operations for listings (uploading, fetching, etc.)

import axios from "axios";
import { getToken } from "./AuthService.js";

const BASE_REST_API_URL = '/bay';

// interceptor modifies the request before it is sent to the server
axios.interceptors.request.use(
    function (config) {
        // get the token
        const token = getToken();

        // if token exists
        if (token) {
            // set Authorization header so backend can authenticate
            config.headers["Authorization"] = 'Bearer ' + token;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Function to get all listings
export function getAllListings() {
    return axios.get(`${BASE_REST_API_URL}/api/listings`);
}

// Function to get user-specific listings
export function getUserListings() {
    return axios.get(`${BASE_REST_API_URL}/api/listings/user`);
}

