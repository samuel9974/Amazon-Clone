/**
 * Cart.jsx - Shopping Cart Page
 *
 * Displays the user's shopping cart with all added items.
 * Features (to be implemented):
 * - List of cart items
 * - Item quantities and prices
 * - Remove item functionality
 * - Cart total
 * - Checkout button
 *
 * Currently a placeholder page.
 */

import React from "react";
import classes from "./Cart.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Cart = () => {
  return (
    <LoyOut>
      <div className={classes.cart_container}>
        <h1>Cart</h1>
        {/* Cart items will be rendered here */}
      </div>
    </LoyOut>
  );
};

export default Cart;
