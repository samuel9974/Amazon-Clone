/**
 * ProdactCard.jsx - Individual Product Card Component
 *
 * Grid card on listing pages; wide layout when flex + renderDescription (product detail).
 */

import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { Types } from "../../Utility/actionType.js";
import { DataContext } from "../DataProvider/DataProvider.jsx";

const ProdactCard = ({ product, flex, renderDescription }) => {
  const [, dispatch] = useContext(DataContext);

  const addToCart = () => {
    dispatch({
      type: Types.ADD_TO_BASKET,
      item: product,
    });
  };

  const ratingValue = product.rating?.rate ?? 0;
  const ratingCount = product.rating?.count ?? 0;
  const priceLabel = Number(product.price).toFixed(2);

  const addToCartBtn = (
    <button
      type="button"
      className="btn btn-warning w-100 rounded-pill fw-bold shadow-sm"
      onClick={addToCart}
    >
      Add to Cart
    </button>
  );

  /* Product detail — horizontal layout */
  if (flex) {
    return (
      <article className="card product-card-flexed border-0 bg-white w-100">
        <div className="card-body p-3 p-md-4">
          <div className="row g-4 flex-column flex-md-row align-items-start">
            <div className="col-12 col-md-auto text-center text-md-start">
              <Link to={`/products/${product.id}`} className="d-inline-block">
                <img
                  src={product.image}
                  alt={product.title}
                  className="img-fluid object-fit-contain product-flex-img"
                />
              </Link>
            </div>

            <div className="col">
              <h1 className="h4 fw-bold mb-3">{product.title}</h1>

              {renderDescription && (
                <p className="text-secondary mb-3" style={{ maxWidth: "750px" }}>
                  {product.description}
                </p>
              )}

              <div className="d-flex align-items-center gap-2 mb-3">
                <Rating value={ratingValue} precision={0.1} readOnly size="small" />
                <small className="text-muted">({ratingCount})</small>
              </div>

              <p className="fs-4 fw-bold text-dark mb-4">${priceLabel}</p>

              <div className="d-inline-block" style={{ minWidth: "150px" }}>
                {addToCartBtn}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* Grid card — home / category results */
  return (
    <article className="card product-card-grid shadow-sm border-0 bg-white h-100 text-dark">
      <Link
        to={`/products/${product.id}`}
        className="d-block text-decoration-none p-2 pb-0"
      >
        <img
          src={product.image}
          alt={product.title}
          className="card-img-top object-fit-contain product-grid-img mx-auto d-block"
        />
      </Link>

      <div className="card-body d-flex flex-column pb-5">
        <h2 className="card-title h6 fw-semibold mb-2 text-dark">{product.title}</h2>

        <div className="d-flex align-items-center gap-1 mb-2">
          <Rating value={ratingValue} precision={0.1} readOnly size="small" />
          <small className="text-muted">({ratingCount})</small>
        </div>

        <p className="fs-5 fw-bold mb-0 mt-auto">${priceLabel}</p>
      </div>

      <div className="product-add-btn-wrap position-absolute bottom-0 start-0 end-0 p-2 bg-white bg-opacity-75">
        {addToCartBtn}
      </div>
    </article>
  );
};

export default ProdactCard;
