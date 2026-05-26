import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="container py-5 text-center">
      <h1 className="display-4 fw-bold">404</h1>
      <p className="lead text-muted">Page not found</p>
      <Link to="/" className="btn btn-warning">
        Back to home
      </Link>
    </section>
  );
};

export default NotFound;
