/* @jsxRuntime classic */
import React from 'react';
import "../styles/ProductCards.css";

function ProductCards(props) {
  return (
    <div className="card">
      <div className="card-media">
        <img className="card-img-top" src={props.image} alt={props.name} />
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <div className="card-meta">
          {props.subject && (
            <span className="subject-chip">{props.subject}</span>
          )}
          <span className="price">{formatPrice(props.price)}</span>
        </div>
      </div>
    </div>
  );
}

function formatPrice(value) {
  const n = Number(String(value).replace(/[^0-9.]/g, ''));
  if (!isFinite(n)) return '';
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);
}

export default ProductCards;
