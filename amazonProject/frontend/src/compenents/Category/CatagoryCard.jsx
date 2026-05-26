import React from "react";
import { Link } from "react-router-dom";

/**
 * CatagoryCard.jsx — single category tile (Bootstrap 5 card).
 * Links to /category/:slug using data.name from catalogApi mapping.
 */

const CatagoryCard = ({ data }) => {
  return (
    <article className="card h-100 w-100 shadow-sm border-0 bg-white category-card-hover">
      <Link
        to={`/category/${data.name}`}
        className="text-decoration-none text-dark d-flex flex-column h-100 category-card-link"
      >
        <div className="card-body pb-2">
          <h2 className="card-title h6 fw-bold mb-0 text-truncate">{data.title}</h2>
        </div>

        <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3 category-card-image-wrap">
          <img
            src={data.imglink}
            alt={data.title}
            className="img-fluid object-fit-contain category-card-img"
            loading="lazy"
          />
        </div>

        <div className="card-footer bg-white border-0 pt-0 pb-3">
          <span className="shop-now">Shop now</span>
        </div>
      </Link>
    </article>
  );
};

export default CatagoryCard;
