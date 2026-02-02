import React from "react";
import classes from "./header.module.css";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

const Header = () => {
  return (
    // Main header container - dark background bar at the top
    <div className={classes.header__container}>
      {/* Left side: Logo and Delivery Location Section */}
      <div className={classes.logo__container}>
        {/* Amazon Logo - links to homepage */}
        <a href="/">
          <img
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
            alt="amazon logo"
          />
        </a>

        {/* Delivery Location Section */}
        <div className={classes.delivery}>
          <span>
            <PlaceIcon />
          </span>
          <div>
            <p>Delivered to</p>
            <span>Israel</span>
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className={classes.search}>
        {/* Category dropdown - allows filtering by product category */}
        <select name="" id="">
          <option value="all">All</option>
        </select>

        {/* Search input field */}
        <input type="text" placeholder="Search Amazon" />

        {/* Search button icon */}
        <SearchIcon />
      </div>

      {/* Right side: Navigation Links and Account Section */}
      <div className={classes.order__container}>
        {/* Language selector with country flag */}
        <a href="" className={classes.language}>
          <img
            src="https://flagcdn.com/w40/us.png"
            alt="us flag"
            width="30"
            height="20"
          />
          <select name="" id="">
            <option value="">EN</option>
          </select>
        </a>

        {/* Sign In / Account Link */}
        <a href="">
          <p>Hello, sign in</p>
          <span>Account & Lists</span>
        </a>

        {/* Returns and Orders Link */}
        <a href="">
          <p>Returns</p>
          <span>& Orders</span>
        </a>

        {/* Shopping Cart Icon with item counter */}
        <a href="/cart" className={classes.cart}>
          <ProductionQuantityLimitsIcon />
          <span>0</span>
        </a>
      </div>
    </div>
  );
};
export default Header;
