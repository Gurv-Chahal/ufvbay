/* @jsxRuntime classic */
import React from 'react';
import { useState, useEffect } from "react";
import "../styles/Item.css";
import Map from "../components/Map.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getUserById } from "../services/AuthService.js"; // adjust path if needed
import testImageOne from "../images/testimg2.jpeg";
import testImageTwo from "../images/testingimg.jpg";
import testImageThree from "../images/testingimg6.jpg";

const DEV_MOCK_PRODUCT_ID = "mock";
const DEV_MOCK_LISTING = {
  id: DEV_MOCK_PRODUCT_ID,
  title: "Calculus I Textbook + Workbook",
  subject: "MATH",
  amount: 45,
  description:
    "Used for one semester and still in great condition.\n\nIncludes the main textbook, the companion workbook, and a few highlighted study notes tucked inside. Good option if you want something affordable for MATH 141.",
  latitude: 49.02837,
  longitude: -122.28492,
  imageUrls: [testImageOne, testImageTwo, testImageThree],
  userId: "mock-user",
};

const Item = ({ asModal = false }) => {

  // state
  const { productId } = useParams();
  const [listing, setListing] = useState(null);
  const [count, setCount] = useState(0);
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [posterEmail, setPosterEmail] = useState("");

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


  useEffect(() => {
    if (import.meta.env.DEV && productId === DEV_MOCK_PRODUCT_ID) {
      setListing(DEV_MOCK_LISTING);
      setSlider(DEV_MOCK_LISTING.imageUrls[0]);
      setCount(0);
      setPosterEmail("student.seller@ufv.ca");
      setIsOwner(false);
      setUpdatedListing({
        title: DEV_MOCK_LISTING.title,
        subject: DEV_MOCK_LISTING.subject,
        amount: DEV_MOCK_LISTING.amount,
        description: DEV_MOCK_LISTING.description,
        longitude: DEV_MOCK_LISTING.longitude,
        latitude: DEV_MOCK_LISTING.latitude,
      });
      setError(null);
      setLoading(false);
      return;
    }

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

  const handleThumbnailSelect = (image, index) => {
    setSlider(image);
    setCount(index);
  };

  const ModalWrapper = ({ children }) =>
      asModal ? (
          <div className="item-overlay">
            <div className="item-panel item-panel--modal">{children}</div>
          </div>
      ) : (
          <div className="item-page">
            <div className="item-page-shell">
              <div className="item-page-topbar">
                <button type="button" className="item-page-back" onClick={handleClose}>
                  <i className="bi bi-arrow-left" />
                  <span>Back to Browse</span>
                </button>

                <div className="item-page-intro">
                  <p className="item-page-kicker">UFVBay Listing</p>
                  <h2 className="item-page-heading">Item Details</h2>
                </div>
              </div>

              <div className="item-panel item-panel--page">{children}</div>
            </div>
          </div>
      );

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
    return <div className="item-state-msg">Loading listing...</div>;
  }

  if (error) {
    return <div className="item-state-msg item-state-error">Error: {error}</div>;
  }

  if (!listing) {
    return <div className="item-state-msg">No listing found.</div>;
  }
  return (
      <ModalWrapper>
        <div className={`item-layout ${asModal ? "item-layout--modal" : "item-layout--page"}`}>
          <section className="item-media-column media-col">
            <div className="item-media-backdrop" />

            {(listing.imageUrls?.length || 0) > 1 && (
                <>
                  <i className="bi bi-chevron-left item-arrow item-arrow-prev" onClick={DecSlider} />
                  <i className="bi bi-chevron-right item-arrow item-arrow-next" onClick={IncSlider} />
                </>
            )}

            {asModal && (
                <button
                    onClick={handleClose}
                    className="item-close"
                    aria-label="Close"
                    title="Close"
                >
                  <i className="bi bi-x-lg" />
                </button>
            )}

            <div className="item-media-content">
              <div className="item-media-stage">
                {slider ? (
                  <img
                    src={slider}
                    alt="Listing"
                    className="media-img"
                  />
                ) : (
                    <div className="item-no-image">
                      <p>No image available</p>
                    </div>
                )}
              </div>

              {(listing.imageUrls?.length || 0) > 1 && (
                  <div className="item-thumb-strip">
                    {listing.imageUrls.map((image, index) => (
                        <button
                            type="button"
                            key={`${listing.id || "listing"}-${index}`}
                            className={`item-thumb ${slider === image ? "is-active" : ""}`.trim()}
                            onClick={() => handleThumbnailSelect(image, index)}
                            aria-label={`View image ${index + 1}`}
                        >
                          <img src={image} alt={`${listing.title || "Listing"} view ${index + 1}`} />
                        </button>
                    ))}
                  </div>
              )}
            </div>
          </section>

          {/* -------- RIGHT: clean details panel -------- */}
          <aside
          className="details-panel"
          >
            <header className="item-header">
              <h1 className="item-title">{listing.title || "Untitled"}</h1>
              <div className="item-chips">
                <span className="item-chip">{listing.subject || "Unknown"}</span>
                <span className="item-chip">Email: {posterEmail || "Unknown"}</span>
              </div>
            </header>

            <hr className="item-divider" />

            <div className="item-price-row">
              <div className="item-price">${listing.amount ?? "N/A"} CAD</div>

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

            <hr className="item-divider" />

            <section className="item-section">
              <button
                  type="button"
                  className="item-section-toggle"
                  onClick={() => setShowMap((v) => !v)}
                  aria-expanded={showMap}
              >
                <span className="item-section-heading">
                  <i className="bi bi-geo-alt" />
                  <span>Meeting Spot</span>
                </span>
                <i className={`bi bi-chevron-down item-section-chevron ${showMap ? "open" : ""}`} />
              </button>

              {showMap ? (
                    Number.isFinite(listing.latitude) && Number.isFinite(listing.longitude) ? (
                          <div className="map-wrap">
                              {/* If your Map prefers a tuple, pass [lat, lng] instead of an object */}
                              <Map position={{ lat: listing.latitude, lng: listing.longitude }} />
                            </div>
                        ) : (
                      <p className="muted item-empty-note">No meeting spot specified.</p>
                  )
              ) : null}
            </section>

            <hr className="item-divider" />

            <section className="item-section">
              <div className="item-section-label">
                <span className="item-section-heading">
                  <i className="bi bi-text-left" />
                  <span>Listing Description</span>
                </span>
              </div>
              <div className="item-desc">
                {listing?.description || "No description provided."}
              </div>
            </section>

            {isOwner && (
                <>
                  <hr className="item-divider" />
                  <div className="item-actions">
                    <button className="btn-ufv" onClick={handleUpdateClick}>
                      <i className="bi bi-pencil" />
                      <span>Edit</span>
                    </button>
                    <button className="btn-ufv-danger" onClick={handleDeleteListing}>
                      <i className="bi bi-trash" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
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
                      <button type="submit" className="btn-ufv">
                        Save Changes
                      </button>
                      <button
                          type="button"
                          className="btn-ufv-outline"
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
