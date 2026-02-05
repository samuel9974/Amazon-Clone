import React from "react";
import classes from "./Orders.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";


const Orders = () => {
  return (
    <LoyOut>
      <div className={classes.orders}>
        <h1>Your Orders</h1>
        <p>You have no orders yet.</p>
      </div>
    </LoyOut>
  );
};

export default Orders;
