/**
 * ProductDetail.jsx - Product Details Page
 *
 * Displays detailed information about a single product.
 * Features:
 * - Fetches product data based on productId from URL parameters
 * - Shows full product description
 * - Product image
 * - Star rating and reviews
 * - Price
 * - Add to cart button
 * - Loading state while fetching data
 *
 * Route: /products/:productId
 */

import React, { useState, useEffect } from "react";
import classes from "./ProductDetail.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoints.js";
import ProdactCard from "../../compenents/Prodact/ProdactCard.jsx";
import Loader from "../../compenents/Loader/Loader.jsx";

const ProductDetail = () => {
  // Get product ID from URL parameters
  const { productId } = useParams();
  const [product, setProduct] = useState({}); // Store product data
  const [isLoading, setIsLoading] = useState(true); // Show loader

  // Fetch product details when component mounts or productId changes
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
      {/* Show loader while fetching, otherwise display product details */}
      {isLoading ? (
        <Loader />
      ) : (
        // Display product as a card with description shown
        <ProdactCard
          product={product}
          flex={true} // Full-width layout
          renderDescription={true} // Show full description
        />
      )}
    </LoyOut>
  );
};

export default ProductDetail;
