/**
 * Orders.jsx - Order History Page
 *
 * Displays the user's past orders and order history.
 * Features (to be implemented):
 * - List of previous orders
 * - Order details (items, dates, totals)
 * - Order status
 * - Reorder functionality
 *
 * Currently shows a placeholder message.
 */

import React from "react";
import classes from "./Orders.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Orders = () => {
  return (
    <LoyOut>
      <div className={classes.orders}>
        <h1>Your Orders</h1>
        <p>You have no orders yet.</p>
        {/* Orders list will be rendered here */}
      </div>
    </LoyOut>
  );
};

export default Orders;
