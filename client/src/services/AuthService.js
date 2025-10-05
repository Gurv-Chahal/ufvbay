import axios from "axios";





// use authAxios to call authentication related calls like loginAPIcall() or registerAPIcall()
const authAxios = axios.create({
  // base url for authentication endpoints
  baseURL: "/bay/auth/",
  // set default content-type to json so that the server can parse it correctly
  headers: {
    "Content-Type": "application/json",
  },
});

// use apiAxios as a general backend endpoint not related to authentication such as fetching data or listings
const apiAxios = axios.create({
  // base url for backend endpoints
  baseURL: "/bay",
  // set default context type to json so that server can parse correctly
  headers: {
    "Content-Type": "application/json",
  },
});


// modify general outgoing requests before it gets to the server
apiAxios.interceptors.request.use(

    // retrieve jwt token
  (config) => {
    const token = getToken();

    // if token exists
    if (token) {
      // attach the token to the authorization header with the correct value 'Bearer JWTtoken'
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// login api call used in Login.jsx sends a post request to the login endpoint
// with the provided username/email and password in the field
export const loginAPICall = (usernameOrEmail, password) => {
  return authAxios.post("login", {
    usernameOrEmail,
    password,
  });
};

// register api used in Signup.jsx sends a post request to the register endpoint with the userdata
export const registerAPICall = (userData) => {
  return authAxios.post("register", userData);
};



// sends api call to backend for edit profile button in account info
export const updateUserInfo = async (updatedUser) => {

  // Get JWT token from local storage
  const token = getToken();

  // use put mapping to update and send update request
  const response = await axios.put(

      // url
      "/bay/api/users/update",
      // data sent to rest api
      updatedUser,
      {

        // attach jwt token and put into json format
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
  );
  return response.data;
};



// Function to store the user id in local storage
export const storeUserId = (userId) => {
  // saves user id with key userId
  localStorage.setItem("userId", userId);
};

// function to store the jwt token in local storage
export const storeToken = (token) => {
  // saves jwt with key "token"
  localStorage.setItem("token", token);
};


// function to retrieve the jwt token from local storage
export const getToken = () => {
  // retrieve token using key "token"
  const token = localStorage.getItem("token");
  return token;
};


// function to fetch user info from backend by calling rest api
export const getUserInfo = async () => {

  // retrieve jwt token
  const token = getToken();

  // if there is no token return null
  if (!token) {
    return null;
  }

  try {

    //call backend api tp get the User info
    const response = await apiAxios.get(`/api/listings/userinfo`);
    // return the data in response.data
    return response.data;


  } catch (error) {
    console.error("Error fetching user info from backend:", error);
    return null;
  }
};

// fetch any user's public profile by id (expects { email, username, ... })
export const getUserById = async (userId) => {
  if (!userId) return null;
  try {
    const res = await apiAxios.get(`/api/users/${userId}`);
    return res.data;
  } catch (e) {
    console.error("getUserById failed:", e);
    return null;
  }
};


// function to save logged in user username in session storage
export const saveLoggedInUser = (username) => {
  // save username with key authenticatedUser
  sessionStorage.setItem("authenticatedUser", username);
};

// function to check if a user is logged in by looking for the username in session storage
export const isUserLoggedIn = () => {
  // get username in sessionstorage with key authenticatedUser
  const username = sessionStorage.getItem("authenticatedUser");
  return username !== null;
};


// logout function clears everything and reloads the page
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  sessionStorage.removeItem("authenticatedUser"); // ok to keep for greetings if you use it
  window.dispatchEvent(new Event("auth-changed"));
};
