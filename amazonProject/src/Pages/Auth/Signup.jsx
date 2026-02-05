import React from "react";
import classes from "./SignUp.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Signup = () => {
  return (
    <LoyOut>
      <div className={classes.signup_container}>
        <h1>Sign Up</h1>
      </div>
    </LoyOut>
  );
};

export default Signup;
