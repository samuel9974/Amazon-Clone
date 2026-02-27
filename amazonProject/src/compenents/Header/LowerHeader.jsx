/**
 * LowerHeader.jsx - Secondary Navigation Menu
 *
 * Displays the secondary navigation menu below the main header.
 * Includes categories and quick links like:
 * - All (hamburger menu)
 * - Today's Deals
 * - Customer Service
 * - Registry
 * - Gift Cards
 * - Sell
 */

import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import classes from "./header.module.css";

const LowerHeader = () => {
  return (
    <div className={classes.lower__container}>
      {/* Navigation menu with category links and quick access items */}
      <ul>
        {/* Hamburger menu with "All" option - typically opens full category menu */}
        <li>
          <MenuIcon />
          <p>All</p>
        </li>
        <li>Today's Deals</li>
        <li>Customer Service</li>
        <li>Registry</li>
        <li>Gift Cards</li>
        <li>Sell</li>
      </ul>
    </div>
  );
};

export default LowerHeader;
