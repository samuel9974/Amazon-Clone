import React from "react";
import classes from "./ProductDetail.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const ProductDetail = () => {
  return (
    <LoyOut>
      <div className={classes.productdetail_container}>
        <h1>Product Detail</h1>
      </div>
    </LoyOut>
  );
};

export default ProductDetail;
