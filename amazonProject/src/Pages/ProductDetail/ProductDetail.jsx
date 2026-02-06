import React, { useState, useEffect } from "react";
import classes from "./ProductDetail.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoints.js";
import ProdactCard from "../../compenents/Prodact/ProdactCard.jsx";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`${productUrl}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productId]);

  return (
    <LoyOut>
      {product.id ? <ProdactCard product={product} /> : <div>Loading...</div>}
    </LoyOut>
  );
};
export default ProductDetail;
