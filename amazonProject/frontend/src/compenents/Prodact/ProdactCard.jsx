/**
 * ProdactCard.jsx - Individual Product Card Component
 */

import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const ProdactCard = ({ product, flex, renderDescription }) => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setAdding(true);
    setMessage("");

    try {
      await addItem(product.id, 1);
      setMessage("Added to cart");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  const ratingValue = product.rating?.rate ?? 0;
  const ratingCount = product.rating?.count ?? 0;
  const priceLabel = Number(product.price).toFixed(2);

  const addToCartBtn = (
    <div>
      <button
        type="button"
        className="btn btn-warning rounded-pill fw-bold w-100 btn-add-to-cart border"
        onClick={addToCart}
        disabled={adding}
      >
        {adding ? "Adding…" : "Add to Cart"}
      </button>
      {message && (
        <small
          className={`d-block mt-1 text-center ${message.includes("Added") ? "text-success" : "text-danger"}`}
        >
          {message}
        </small>
      )}
    </div>
  );

  if (flex) {
    return (
      <article className="card border-0 bg-white w-100 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="row g-4 flex-column flex-md-row align-items-start">
            <div className="col-12 col-md-auto text-center text-md-start">
              <Link to={`/products/${product.id}`} className="d-inline-block">
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-fluid object-fit-contain"
                  style={{ maxHeight: 300 }}
                />
              </Link>
            </div>

            <div className="col">
              <h1 className="h4 fw-bold mb-3 text-dark">{product.title}</h1>

              {renderDescription && (
                <p className="text-secondary mb-3" style={{ maxWidth: "750px" }}>
                  {product.description}
                </p>
              )}

              <div className="d-flex align-items-center gap-2 mb-3">
                <Rating value={ratingValue} precision={0.1} readOnly size="small" />
                <small className="text-secondary">({ratingCount})</small>
              </div>

              <p className="fs-4 fw-bold text-dark mb-4">${priceLabel}</p>

              <div style={{ maxWidth: "220px" }}>{addToCartBtn}</div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card product-card-grid h-100 bg-white border shadow-sm">
      <Link
        to={`/products/${product.id}`}
        className="d-block text-decoration-none px-3 pt-3"
      >
        <img
          src={product.image}
          alt={product.title}
          className="card-img-top object-fit-contain mx-auto d-block product-grid-img border-0 bg-white"
        />
      </Link>

      <div className="card-body d-flex flex-column px-3 pt-2 pb-3">
        <h2 className="card-title h6 fw-bold text-dark mb-2 lh-sm">
          {product.title}
        </h2>

        <div className="d-flex align-items-center gap-1 mb-2">
          <Rating value={ratingValue} precision={0.1} readOnly size="small" />
          <small className="text-secondary">({ratingCount})</small>
        </div>

        <p className="fs-5 fw-bold text-dark mb-3">${priceLabel}</p>

        <div className="mt-auto">{addToCartBtn}</div>
      </div>
    </article>
  );
};

export default ProdactCard;
