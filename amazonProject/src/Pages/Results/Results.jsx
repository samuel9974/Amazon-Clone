import React from "react";
import classes from "./Results.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Results = () => {
  return (
    <LoyOut>
      <div className={classes.results_container}>
        <h1>Results</h1>
      </div>
    </LoyOut>
  );
};

export default Results;
