/* @jsxRuntime classic */
import React from 'react';

import "../styles/ProductCards.css";

function ProductCards(props) {
  //ProductCards component takes in a  value from the object
  return (
    <>
      {/* Styling for cards */}
      <div className="card">
        {/* What to do with each attribute from the passed down object */}
          <div className="card-media">
              <img className="card-img-top" src={props.image} alt={props.name} />
          </div>
          <div className="card-body">
              <h5 className="small-text ellipsis-text">{props.name}</h5>
              <p className="price">{formatPrice(props.price)}</p>

          </div>
      </div>
    </>
  );
}

function formatPrice(value) {
    // strip everything except digits and decimal point
    const n = Number(String(value).replace(/[^0-9.]/g, ''));
    if (!isFinite(n)) return '';       // or return value
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);
}


export default ProductCards;
