import React from "react";
import classes from "./Payment.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Payment = () => {
  return (
    <LoyOut>
      <div className={classes.payment_container}>
        <h1>Payment</h1>
      </div>
    </LoyOut>
  );
};

export default Payment;
