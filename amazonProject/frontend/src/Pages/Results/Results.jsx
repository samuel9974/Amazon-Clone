import React, { useEffect, useState } from "react";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";
import { useParams } from "react-router-dom";
import ProdactCard from "../../compenents/Prodact/ProdactCard.jsx";
import Loader from "../../compenents/Loader/Loader.jsx";
import { fetchProductsByCategory } from "../../Api/catalogApi.js";

const Results = () => {
  const { categoryName } = useParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchProductsByCategory(categoryName.toLowerCase())
      .then((items) => {
        setResults(items);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching category products:", error);
        setIsLoading(false);
      });
  }, [categoryName]);

  return (
    <LoyOut>
      <section className="container py-4">
        <h1 className="h3 px-2 px-md-4 pt-3">Results</h1>
        <p className="text-muted px-2 px-md-4">Category / {categoryName}</p>
        <hr className="mx-2 mx-md-4" />

        <div className="container-fluid products-grid-section" style={{ marginTop: "2rem" }}>
          {isLoading ? (
            <Loader />
          ) : results.length === 0 ? (
            <p className="text-center text-muted py-5">No products in this category.</p>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 justify-content-center">
              {results.map((product) => (
                <div className="col d-flex justify-content-center" key={product.id}>
                  <ProdactCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </LoyOut>
  );
};

export default Results;
