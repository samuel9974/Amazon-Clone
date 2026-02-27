/**
 * Prodact.jsx - Products List Container
 *
 * Displays a grid of all available products fetched from the Fake Store API.
 * Handles:
 * - Fetching products from the API
 * - Loading state management
 * - Error handling
 * - Rendering each product as a ProductCard
 *
 * API call: GET https://fakestoreapi.com/products
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import ProdactCard from "./ProdactCard.jsx";
import classes from "./prodact.module.css";
import Loader from "../Loader/Loader.jsx";

const Prodact = () => {
  const [prodacts, setProdacts] = useState([]); // Store fetched products
  const [isLoading, setIsLoading] = useState(true); // Show loader while fetching

  // Fetch all products when component mounts
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProdacts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <div className={classes.products_container}>
      {/* Show loader while fetching, otherwise display all products */}
      {isLoading ? (
        <Loader />
      ) : (
        prodacts.map((singleprodact) => (
          <ProdactCard product={singleprodact} key={singleprodact.id} />
        ))
      )}
    </div>
  );
};

export default Prodact;
