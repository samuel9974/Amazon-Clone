/**
 * CatagoryCard.jsx - Individual Category Card Component
 *
 * Displays a single category card with image and title.
 * Clicking the card navigates to the category results page showing products in that category.
 *
 * Props:
 * - data: Object containing { title, name, imglink }
 *   - title: Display name for the category
 *   - name: URL-friendly category name
 *   - imglink: Image URL for the category
 */

import React from "react";
import classes from "./category.module.css";
import { Link } from "react-router-dom";

const CatagoryCard = ({ data }) => {
  return (
    <div className={classes.category}>
      {/* Link to category results page with filtered products */}
      <Link to={`/category/${data.name}`}>
        <span>
          <h1>{data.title}</h1>
        </span>
        <img src={data.imglink} alt={data.name} />
        <p>shop now</p>
      </Link>
    </div>
  );
};

export default CatagoryCard;
