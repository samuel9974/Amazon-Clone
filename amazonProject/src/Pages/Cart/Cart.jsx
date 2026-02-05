import React from "react";
import classes from "./Cart.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Cart = () => {
  return (
    <LoyOut>
      <div className={classes.cart_container}>
        <h1>Cart</h1>
      </div>
    </LoyOut>
  );
};

export default Cart;
