import React, { useState, useEffect } from "react";
import axios from "axios";
import ProdactCard from "./ProdactCard.jsx";
import classes from "./prodact.module.css";

const Prodact = () => {
  const [prodacts, setProdacts] = useState([]);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        console.log(res.data);
        setProdacts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={classes.products_container}>
      {prodacts.map((singleprodact) => (
        <ProdactCard product={singleprodact} key={singleprodact.id} />
      ))}
    </div>
  );
};

export default Prodact;
