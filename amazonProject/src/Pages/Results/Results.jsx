/**
 * Results.jsx - Search Results / Category Filtered Products Page
 *
 * Displays filtered products based on the selected category.
 * Features:
 * - Fetches products for a specific category
 * - Displays category name in the page header
 * - Shows all products in that category
 * - Loading state while fetching data
 *
 * Route: /category/:categoryName
 * Gets category name from URL parameters and fetches matching products
 */

import React, { useEffect, useState } from "react";
import classes from "./Results.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";
import { productUrl } from "../../Api/endPoints.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProdactCard from "../../compenents/Prodact/ProdactCard.jsx";
import Loader from "../../compenents/Loader/Loader.jsx";

const Results = () => {
  // Get category name from URL parameters
  const { categoryName } = useParams();
  const [results, setResults] = useState([]); // Store filtered products
  const [isLoading, setIsLoading] = useState(true); // Show loader

  // Fetch products for the selected category whenever categoryName changes
  useEffect(() => {
    setIsLoading(true);
    axios
      // API call to get products by category (converted to lowercase)
      .get(`${productUrl}/products/category/${categoryName.toLowerCase()}`)
      .then((res) => {
        setResults(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setIsLoading(false);
      });
  }, [categoryName]);

  return (
    <LoyOut>
      <section>
        {/* Page header and category info */}
        <h1 style={{ padding: "30px" }}>Results</h1>
        <p style={{ padding: "30px" }}>Category / {categoryName}</p>
        <hr />

        {/* Products grid */}
        <div className={classes.products_container}>
          {/* Show loader while fetching, otherwise display products */}
          {isLoading ? (
            <Loader />
          ) : (
            results?.map((product) => (
              <ProdactCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </LoyOut>
  );
};

export default Results;
