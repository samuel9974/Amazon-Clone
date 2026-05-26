/**
 * Prodact.jsx - Products List Container
 *
 * Fetches all products from GET /api/products and renders a responsive Bootstrap grid.
 */

import React, { useState, useEffect } from "react";
import ProdactCard from "./ProdactCard.jsx";
import Loader from "../Loader/Loader.jsx";
import { fetchAllProducts } from "../../Api/catalogApi.js";

const Prodact = () => {
  const [prodacts, setProdacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    fetchAllProducts()
      .then((items) => {
        setProdacts(items);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Could not load products. Is the backend running? Try http://localhost:5001/install first.",
        );
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return (
      <section className="container-fluid products-grid-section">
        <div className="alert alert-warning text-center mb-0" role="alert">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="container-fluid products-grid-section">
      {isLoading ? (
        <Loader />
      ) : prodacts.length === 0 ? (
        <div className="alert alert-info text-center mb-0" role="status">
          No products found.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 g-lg-5 justify-content-center">
          {prodacts.map((singleprodact) => (
            <div className="col d-flex justify-content-center" key={singleprodact.id}>
              <ProdactCard product={singleprodact} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Prodact;
