import React, { useState, useEffect } from "react";
import axios from "axios";
import ProdactCard from "./ProdactCard.jsx";
import classes from "./prodact.module.css";
import Loader from "../Loader/Loader.jsx";

const Prodact = () => {
  const [prodacts, setProdacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      {isLoading ? <Loader /> : prodacts.map((singleprodact) => (
        <ProdactCard product={singleprodact} key={singleprodact.id} />
      ))}
    </div>
  );
};

export default Prodact;
