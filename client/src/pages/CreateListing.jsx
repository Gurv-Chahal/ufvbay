import { useState } from "react";
import AccountNavBar from "../components/AccountNavBar.jsx";
import AccountSideBar from "../components/AccountSideBar.jsx";
import axios from "axios";
import Dropzone from "react-dropzone";
import Map from "../components/Map.jsx";
import "../styles/CreateListing.css";
import { useNavigate } from "react-router-dom";
/* @jsxRuntime classic */
import React from 'react';
const CreateListing = () => {

  const navigate = useNavigate();


  // state
  const [position, setPosition] = useState(null);
  const [preview, setPreview] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [price, setPrice] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

    // near the top of CreateListing.jsx (after imports)
    const SUBJECTS = [
        "MATH",
        "PHYSICS",
        "COMPUTER SCIENCE",
        "BIOLOGY",
        "CHEMISTRY",
        "ENGLISH",
        "HISTORY",
        "ECONOMICS",
        "PSYCHOLOGY",
        "ENGINEERING",
        "BUSINESS",
        "STATISTICS",
        "PHILOSOPHY"
    ];

  // handles even when user selects or drops images
  const handleDrop = (acceptedFiles) => {
    // store selected image files in state
    setImages((prev) => [...prev, ...acceptedFiles]);

    // Generate image previews
    const newPreviews = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // update state to include previous images and new images
    setPreview((prev) => [...prev, ...newPreviews]);
  };


  // handle submit functionality
  const handleSubmit = async (e) => {
    e.preventDefault();

    // no null fields
    if (!bookTitle || !price || !subject) {
      alert("Please fill in all required fields.");
      return;
    }

    // create FormData object - which is an api that creates key value pairs
    const formData = new FormData();

    // add key value pairs to formdata object
    formData.append("title", bookTitle);
    formData.append("subject", subject);
    formData.append("amount", parseFloat(price));
    formData.append("description", description);

    // Iterate over images array and append each image file to "images" key
    images.forEach((image) => {
      formData.append("images", image);
    });

    // append position data
    if (position) {
      formData.append("latitude", position[0]);
      formData.append("longitude", position[1]);
    }

    try {
      // get JWT token from localstorage using "token" key
      const token = localStorage.getItem("token");

      // send axios api request to CreateListing endpoint in backend
      const response = await axios.post(
        "/bay/api/listings",
        // give backend the data from the form so it can create the listing
        formData,
        {
          // use header Content-Type needed to use Cloudinary api for imaages , Authorization & Bearer token are for user authentication
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // redirect to the listing page when submission is complete
        navigate(`/item/${response.data.id}`);

    } catch (error) {
      console.error("Error adding listing:", error);
      alert("An error occurred while adding the listing. Please try again.");
    }
  };

  return (
      <div className="container-fluid p-0 min-vh-100 listing-page">
        <AccountNavBar/>
        <div className="d-flex">
          <div className="col-md-3 p-0">
            <AccountSideBar/>
          </div>
          <div className="col-md-4 mx-5 px-5 my-5">
            <div className="my-5 py-3">
              <h1 className="mb-5">Listing Details</h1>
              <Map position={position} setPosition={setPosition}/>
              <h4 className="my-2">Where on campus do you want to meet?</h4>
            </div>
            <input
                type="text"
                className="form-control py-2"
                placeholder="Enter Title"
                style={{
                  borderTop: "none",
                  borderLeft: "none",
                  backgroundColor: "#e0e0e0",
                  borderRight: "none",
                }}
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
            />
              <div className="my-3 d-flex">
                  <input
                      type="text"
                      className="form-control py-2"
                      placeholder="Enter Listing Amount"
                      style={{
                          width: "300px",
                          borderTop: "none",
                          borderLeft: "none",
                          borderRight: "none",
                          backgroundColor: "#e0e0e0",
                      }}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                  />
                  <select
                      className="form-control py-2 mx-2"
                      style={{
                          width: "300px",
                          borderTop: "none",
                          borderLeft: "none",
                          borderRight: "none",
                          backgroundColor: "#e0e0e0",
                      }}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                  >
                      <option value="" disabled>Select subject</option>
                      {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                      ))}
                  </select>

              </div>
              <textarea
                  id="description"
                  className="form-control"
                  rows="4"
                  placeholder="Enter your description here"
                  style={{
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      backgroundColor: "#e0e0e0",
                  }}
                  value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
            />
          </div>
          <div
              className="col-md-4 p-0 position-relative my-5 py-5"
              style={{textDecoration: "none"}}
          >
            <div className="my-5 py-5 ">
              <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }}>
                {({getRootProps, getInputProps}) => (
                    <section className="dropzone my-5">
                      <div {...getRootProps()} className="p-3 text-center">
                        <input {...getInputProps()} />
                        <p className="p-3">
                          Add your images here, or click to select your images
                        </p>
                      </div>
                    </section>
                )}
              </Dropzone>
              <div className="mt-3">
                {preview.map((image, index) => (
                    <img
                        key={index}
                        src={image.preview}
                        alt="Preview"
                        style={{width: "150px", marginBottom: "10px"}}
                        className="mx-2"
                    />
                ))}
              </div>
              <button
                  className="btn btn-primary position-absolute"
                  style={{bottom: "20px", right: "20px"}}
                  onClick={handleSubmit}
              >
                Post Listing
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CreateListing;
