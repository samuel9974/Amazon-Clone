import React from "react";
import { Link } from "react-router-dom";

const AMAZON_FOOTER_BG = "#232f3e";

const Footer = () => {
  return (
    <footer className="text-white mt-auto py-4" style={{ backgroundColor: AMAZON_FOOTER_BG }}>
      <div className="container-fluid px-3">
        <div className="row g-3 small">
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Get to Know Us</h6>
            <ul className="list-unstyled text-white-50 mb-0">
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Make Money with Us</h6>
            <ul className="list-unstyled text-white-50 mb-0">
              <li>Sell products</li>
              <li>Become an Affiliate</li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Let Us Help You</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <Link to="/orders" className="text-white-50 text-decoration-none">
                  Your Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white-50 text-decoration-none">
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bold">Account</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <Link to="/signup" className="text-white-50 text-decoration-none">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-3" />
        <p className="text-center text-white-50 small mb-0">
          © {new Date().getFullYear()} Amazon Clone — Educational project
        </p>
      </div>
    </footer>
  );
};

export default Footer;
