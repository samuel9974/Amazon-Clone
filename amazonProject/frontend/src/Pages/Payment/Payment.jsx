/**
 * Payment.jsx - Payment Page
 *
 * Handles the checkout and payment process.
 * Features (to be implemented):
 * - Order summary
 * - Shipping address entry
 * - Payment method selection
 * - Credit card/payment details form
 * - Order confirmation
 *
 * Currently a placeholder page.
 */

import React from "react";
import classes from "./Payment.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Payment = () => {
  return (
    <LoyOut>
      <div className={classes.payment_container}>
        <h1>Payment</h1>
        {/* Payment form and checkout details will be rendered here */}
      </div>
    </LoyOut>
  );
};

export default Payment;
