/* @jsxRuntime classic */
import React from 'react';
import { useState, useEffect } from "react";
import "../styles/Item.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import Map from "../components/Map.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getUserById } from "../services/AuthService.js"; // adjust path if needed
import HomeSideBar from "../components/HomeSideBar.jsx";



const Item = ({ asModal = false }) => {

  // state
  const { id: productId } = useParams();
  const [listing, setListing] = useState(null);
  const [count, setCount] = useState(0);
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [posterEmail, setPosterEmail] = useState("");
  // inside the component
  const [descExpanded, setDescExpanded] = React.useState(false);




  // state for Update Listing functionality
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedListing, setUpdatedListing] = useState({
    title: "",
    subject: "",
    amount: "",
    description: "",
    longitude: "",
    latitude: "",
  });

  const navigate = useNavigate();

  // Wraps content in a centered 80% panel when shown as a modal
  const ModalWrapper = ({ children }) =>
      asModal ? (
          <div className="item-overlay">
            <div className="item-panel">{children}</div>
          </div>
      ) : (
          <>{children}</>
      );


  useEffect(() => {
    // fetch the listing data from the backend
    const fetchListing = async () => {
      try {

        // get the JWT token from localStorage using "token" key
        const token = localStorage.getItem("token");

        // get the user ID from localStorage
        const currentUserId = localStorage.getItem("userId");

        // Call getListingById endpoint in backend
        const response = await axios.get(
          `/bay/api/listings/${productId}`,
            // include jwt authorization header so backend can authenitcate
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // store data retrieved from backend into listingData variable
        const listingData = response.data;
        setListing(listingData);

        // fetch poster email by userId
        if (listingData.userId) {
          const user = await getUserById(listingData.userId);
          setPosterEmail(user?.email ?? "");
        }

        // set the initial slider image
        if (listingData.imageUrls && listingData.imageUrls.length > 0) {
          setSlider(listingData.imageUrls[0]);
        }

        // COmpare the listing's owner ID with the current user ID
        if (
          listingData.userId &&
          currentUserId &&
          listingData.userId.toString() === currentUserId.toString()
        ) {
          setIsOwner(true);
        }

        // initialize updatedListing with existing listing data
        setUpdatedListing({
          title: listingData.title || "",
          subject: listingData.subject || "",
          amount: listingData.amount || "",
          description: listingData.description || "",
          longitude: listingData.longitude || "",
          latitude: listingData.latitude || "",
        });


        // mark loading as complete
        setLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch listing");
        setLoading(false);
      }
    };

    // call function to refetch listing
    fetchListing();
    // rerun the effect if productId state changes
  }, [productId]);

  const handleDeleteListing = async () => {

    // confirm delete listing
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {


        // retrieve JWT token
        const token = localStorage.getItem("token");

        // send API delete request to backend to delete specific listing
        await axios.delete(`/bay/api/listings/${productId}`, {
          // include jwt token for authentication
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // alert deleting successful and go back to home page
        alert("Listing deleted successfully");
        navigate("/");


      } catch (err) {
        console.error("Error deleting listing:", err.response || err);
        alert("Failed to delete listing");
      }
    }
  };

  // handles the logic for going to the next image on Item page
  const IncSlider = () => {


    // if listing exists, listing images exist, and listing images have a length greater then 0
    if (listing && listing.imageUrls && listing.imageUrls.length > 0) {

      // calculate next index , wraps to 0 if at the end
      const newCount = (count + 1) % listing.imageUrls.length;

      // update count state
      setCount(newCount);

      // update slide using array and state
      const newSlider = listing.imageUrls[newCount];
      setSlider(newSlider);
    }
  };

  // handles logic for going to previous image on Item page
  const DecSlider = () => {

    // if listing exists, listing images exist, and listing images have a length greater then 0
    if (listing && listing.imageUrls && listing.imageUrls.length > 0) {

      // calculate prev index, wraps to 0 so it doesn't become negative
      const newCount =
        (count - 1 + listing.imageUrls.length) % listing.imageUrls.length;

      // update count state
      setCount(newCount);
      // update slider image using array
      setSlider(listing.imageUrls[newCount]);
    }
  };



  // handle changes to the input fields in the update form
  const handleInputChange = (e) => {

    // get the name and value from the field
    const { name, value } = e.target;

    // update state
    setUpdatedListing((prevState) => ({
      //copy prev state
      ...prevState,
      // update field
      [name]: value,
    }));
  };




  // Handle form submission to update the listing
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {

      // retrieve JWT token
      const token = localStorage.getItem("token");

      // put new update listing data into object called payload
      const payload = {
        id: listing.id,
        title: updatedListing.title,
        subject: updatedListing.subject,
        amount: parseFloat(updatedListing.amount),
        description: updatedListing.description,
        longitude: parseFloat(updatedListing.longitude),
        latitude: parseFloat(updatedListing.latitude),
        imageUrls: listing.imageUrls,
        userId: listing.userId,
      };


      // send PUT request in listingcontroller to update the listing
      const response = await axios.put(
          // send api request to listings/listingid
        `/bay/api/listings/${listing.id}`,
          // give the api call the payload data to change the new fields
        payload,
        {
          // also include the bearer jwt token and put it into json format so the user can be authenticated before updating listing
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // update the listing state with the response data
      setListing(response.data);

      // hide the update form
      setIsUpdating(false);

      alert("Listing updated successfully!");
    } catch (err) {
      console.error("Error updating listing:", err.response || err);
      alert("Failed to update listing. Please try again.");
    }
  };



  // Handle the "Update Listing" button click
  const handleUpdateClick = () => {
    // set state to true which then will open the update listing box
    setIsUpdating(true);
  };



  // Handle cancelling the update
  const handleCancelUpdate = () => {

    // set state to false which will make the box go away
    setIsUpdating(false);

    // Reset updatedListing state to current listing data
    setUpdatedListing({
      title: listing.title || "",
      subject: listing.subject || "",
      amount: listing.amount || "",
      description: listing.description || "",
      longitude: listing.longitude || "",
      latitude: listing.latitude || "",
    });
  };

  // handle the X button click to navigate back to home
  const handleClose = () => {
    if (asModal) navigate(-1);
    else navigate("/");
  };

  // const handleContactSeller = () => {
  //   if (!posterEmail) return;
  //
  //   const to = encodeURIComponent(posterEmail.trim());
  //   const subject = encodeURIComponent(listing?.title || "Listing");
  //
  //   // build URLs here so they're in scope
  //   const mailto = `mailto:${to}?subject=${subject}`;
  //   const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}`;
  //
  //   // try native mail handler first
  //   const w = window.open(mailto);
  //
  //   // fallback to Gmail if a handler isn't registered / blocked
  //   setTimeout(() => {
  //     try {
  //       if (!w || w.closed) {
  //         window.open(gmailCompose, "_blank", "noopener,noreferrer");
  //       }
  //     } catch {
  //       window.open(gmailCompose, "_blank", "noopener,noreferrer");
  //     }
  //   }, 150);
  // };


  if (loading) {
    return <div>Loading listing...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listing) {
    return <div>No listing found.</div>;
  }
  return (
      <ModalWrapper>
        <div className="row g-0 w-100 h-100" style={{position: "relative"}}>
          {/* -------- LEFT: image slider -------- */}
          <div className="col-7 col-xl-7 d-flex justify-content-center align-items-center position-relative media-col"
              style={{
                backgroundImage: "none",
                backgroundPosition: "center",
                backgroundSize: "cover",      // or "contain" if you prefer
                height: "100%",
                overflow: "hidden",
              }}
          >
            {/* darken bg behind the main image */}
            <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                }}
            />

            {/* prev / next */}
            <ArrowBackIosIcon
                onClick={DecSlider}
                style={{
                  zIndex: 3,
                  color: "white",
                  fontSize: "2rem",
                  cursor: "pointer",
                  position: "absolute",
                  left: "10px",
                }}
            />
            <ArrowForwardIosIcon
                onClick={IncSlider}
                style={{
                  zIndex: 3,
                  color: "white",
                  fontSize: "2rem",
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                }}
            />

            {/* current image */}
            {slider ? (
              <img
            src={slider}
            alt="Listing"
            className="media-img position-relative mx-auto"
            style={{ zIndex: 2 }}
            />
            ) : (
                <div
                    className="w-50 position-relative mx-auto"
                    style={{
                      zIndex: 2,
                      height: "300px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                >
                  <p>No image available</p>
                </div>
            )}

            <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "2.5rem",
                  cursor: "pointer",
                  zIndex: 5,
                }}
                aria-label="Close"
                title="Close"
            >
              <DisabledByDefaultIcon fontSize="inherit"/>
            </button>

          </div>

          {/* -------- RIGHT: clean details panel -------- */}
          <aside
          className="col-5 col-xl-5 details-panel"
          >
            {/* header */}
            <header className="details-header">
              <h1 className="details-title">{listing.title || "Untitled"}</h1>
              <div className="chip-row">
                <span className="chip">{listing.subject || "Unknown"}</span>
                <span className="chip"> Email: {posterEmail || "Unknown"} </span>
              </div>
            </header>

            {/* price + CTA */}
            <div className="price-cta">
              <div className="price-tag">${listing.amount ?? "N/A"} CAD </div>

              {/*<button*/}
              {/*    type="button"*/}
              {/*    className="cta-button"*/}
              {/*    onClick={handleContactSeller}*/}
              {/*    disabled={!posterEmail}*/}
              {/*    aria-disabled={!posterEmail}*/}
              {/*    title={posterEmail ? `Email ${posterEmail}` : "Seller email unavailable"}*/}
              {/*>*/}
              {/*  Contact Seller*/}
              {/*</button>*/}
            </div>


            {/* meeting spot */}
            <section className="section-card">
              <button
                  type="button"
                  className="section-title"
                  onClick={() => setShowMap((v) => !v)}
                  aria-expanded={showMap}
              >
                <span>Meeting Spot</span>
                <span className={`chev ${showMap ? "open" : ""}`}>▾</span>
              </button>

              {showMap ? (
                    Number.isFinite(listing.latitude) && Number.isFinite(listing.longitude) ? (
                          <div className="map-wrap">
                              {/* If your Map prefers a tuple, pass [lat, lng] instead of an object */}
                              <Map position={{ lat: listing.latitude, lng: listing.longitude }} />
                            </div>
                        ) : (
                      <p className="muted">No meeting spot specified.</p>
                  )
              ) : null}
            </section>

            {/* description */}
            <section className="section-card">
              <div className="section-title static">Listing Description</div>
              <div className="desc desc--scroll">
                {listing?.description || "No description provided."}
              </div>
            </section>

            {/* owner actions */}
            {isOwner && (
                <div className="owner-actions">
                  <button className="btn-ui btn-solid" onClick={handleUpdateClick}>
                    Edit
                  </button>
                  <button className="btn-ui btn-danger" onClick={handleDeleteListing}>
                    Delete
                  </button>
                </div>
            )}

            {/* previous close */}

          </aside>

          {/* -------- Update form overlay (unchanged) -------- */}
          {isUpdating && (
              <div className="update-form-overlay">
                <div className="update-form-container">
                  <h2 className="updateformlisting">Update Listing</h2>
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="form-group">
                      <label>Title:</label>
                      <input
                          type="text"
                          name="title"
                          value={updatedListing.title}
                          onChange={handleInputChange}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Subject:</label>
                      <input
                          type="text"
                          name="subject"
                          value={updatedListing.subject}
                          onChange={handleInputChange}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Amount:</label>
                      <input
                          type="number"
                          name="amount"
                          step="0.01"
                          value={updatedListing.amount}
                          onChange={handleInputChange}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                          name="description"
                          value={updatedListing.description}
                          onChange={handleInputChange}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Longitude:</label>
                      <input
                          type="number"
                          name="longitude"
                          step="0.0001"
                          value={updatedListing.longitude}
                          onChange={handleInputChange}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Latitude:</label>
                      <input
                          type="number"
                          name="latitude"
                          step="0.0001"
                          value={updatedListing.latitude}
                          onChange={handleInputChange}
                          required
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancelUpdate}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          )}
        </div>
      </ModalWrapper>
  );


};

export default Item;
