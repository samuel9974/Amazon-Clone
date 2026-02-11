import React, { useState, useEffect } from "react";
import classes from "./ProductDetail.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoints.js";
import ProdactCard from "../../compenents/Prodact/ProdactCard.jsx";
import Loader from "../../compenents/Loader/Loader.jsx";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${productUrl}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [productId]);

  return (
    <LoyOut>
      {isLoading ? <Loader /> : <ProdactCard product={product} flex={true} 
      renderDescription={true} />}
    </LoyOut>
  );
};
export default ProductDetail;
