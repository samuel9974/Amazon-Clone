import React, { useEffect, useState } from "react";
import classes from "./Results.module.css";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";
import { productUrl } from "../../Api/endPoints.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProdactCard from "../../compenents/Prodact/ProdactCard.jsx";
import Loader from "../../compenents/Loader/Loader.jsx";

const Results = () => {
  const { categoryName } = useParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
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
        <h1 style={{ padding: "30px" }}>Results</h1>
        <p style={{ padding: "30px" }}>Category / {categoryName}</p>
        <hr />
        <div className={classes.products_container}>
          {isLoading ? <Loader /> : results?.map((product) => (
            <ProdactCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </LoyOut>
  );
};
export default Results;
