/**
 * Signup.jsx - Sign Up / Authentication Page
 *
 * User authentication and registration page.
 * Features (to be implemented):
 * - Account creation form
 * - User email and password input
 * - Sign up / Create account button
 * - Login link for existing users
 * - Form validation
 * - Authentication logic
 *
 * Currently a placeholder page.
 */

import React from "react";
import classes from "./SignUp.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Signup = () => {
  return (
    <LoyOut>
      <div className={classes.signup_container}>
        <h1>Sign Up</h1>
        {/* Sign up form will be rendered here */}
      </div>
    </LoyOut>
  );
};

export default Signup;
