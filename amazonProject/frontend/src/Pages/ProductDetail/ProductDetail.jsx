import React, { useState, useEffect } from "react";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";
import { useParams } from "react-router-dom";
import ProdactCard from "../../compenents/Prodact/ProdactCard.jsx";
import Loader from "../../compenents/Loader/Loader.jsx";
import { fetchProductById } from "../../Api/catalogApi.js";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchProductById(productId)
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [productId]);

  return (
    <LoyOut>
      <div className="product-detail-wrap">
        {isLoading ? (
          <Loader />
        ) : !product ? (
          <p className="text-center text-muted py-5">Product not found.</p>
        ) : (
          <ProdactCard product={product} flex={true} renderDescription={true} />
        )}
      </div>
    </LoyOut>
  );
};

export default ProductDetail;
