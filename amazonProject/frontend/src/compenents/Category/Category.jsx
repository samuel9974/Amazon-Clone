/**
 * Category.jsx - Category List Container
 *
 * Responsive grid via Bootstrap: 1 col (mobile) → 2 (tablet) → 4 (desktop).
 * Data from GET /api/categories.
 */

import React, { useState, useEffect } from "react";
import CatagoryCard from "./CatagoryCard.jsx";
import Loader from "../Loader/Loader.jsx";
import { fetchCategories } from "../../Api/catalogApi.js";

const Category = () => {
  const [categoryImage, setCategoryImage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchCategories()
      .then((data) => {
        if (cancelled) return;
        setCategoryImage(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load categories:", err);
        setError(
          "Could not load categories. Is the backend running on port 5001?",
        );
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="container-fluid category-hero-overlap">
        <div className="alert alert-warning text-center mb-0" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (categoryImage.length === 0) {
    return (
      <section className="container-fluid category-hero-overlap">
        <div className="alert alert-info text-center mb-0" role="status">
          No categories found. Run{" "}
          <a
            href="http://localhost:5001/install"
            target="_blank"
            rel="noreferrer"
            className="alert-link"
          >
            /install
          </a>{" "}
          to seed the database.
        </div>
      </section>
    );
  }

  return (
    <section className="container-fluid category-hero-overlap">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 g-md-4 justify-content-center">
        {categoryImage.map((categoryInfo) => (
          <div className="col d-flex" key={categoryInfo.name}>
            <CatagoryCard data={categoryInfo} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
