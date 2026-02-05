import React from "react";
import { Link } from "react-router-dom";
import classes from "./header.module.css";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LowerHeader from "./LowerHeader.jsx";
const Header = () => {
  return (
    // Main header container - dark background bar at the top
    <section>
      <div className={classes.header__container}>
        {/* Left side: Logo and Delivery Location Section */}
        <div className={classes.logo__container}>
          {/* Amazon Logo - links to homepage */}
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="amazon logo"
            />
          </Link>

          {/* Delivery Location Section */}
          <div className={classes.delivery}>
            <span>
              <PlaceIcon />
            </span>
            <div>
              <p>Delivered to </p>
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
          <Link to="/language" className={classes.language}>
            <img
              src="https://flagcdn.com/w40/il.png"
              alt="israel flag"
              width="30"
              height="20"
            />
            <select name="" id="">
              <option value="">EN</option>
            </select>
          </Link>

          {/* Sign In / Account Link */}
          <Link to="/signup">
            <p>Hello, sign in</p>
            <span>Account & Lists</span>
          </Link>

          {/* Returns and Orders Link */}
          <Link to="/orders">
            <p>Returns</p>
            <span>& Orders</span>
          </Link>

          {/* Shopping Cart Icon with item counter */}
          <Link to="/cart" className={classes.cart}>
            <ProductionQuantityLimitsIcon />
            <span>0</span>
          </Link>
        </div>
      </div>
      <LowerHeader />
    </section>
  );
};
export default Header;
