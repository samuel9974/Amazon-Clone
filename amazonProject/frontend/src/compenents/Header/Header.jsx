import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LowerHeader from "./LowerHeader.jsx";
import { useCategoriesContext } from "../Category/CategoriesProvider.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

/**
 * Header.jsx - Main Application Header
 *
 * Amazon-style top bar built with Bootstrap 5 (same layout & behavior as before).
 */

const AMAZON_NAV_BG = "#131921";
const AMAZON_SEARCH_BTN = "#febd69";

const Header = () => {
  const { categories } = useCategoriesContext();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const displayName =
    user?.fullName?.split(" ")[0] || user?.email?.split("@")[0] || "Account";

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const onCategoryChange = (e) => {
    const slug = e.target.value;
    if (slug && slug !== "all") {
      navigate(`/category/${slug}`);
    }
  };

  return (
    <section className="sticky-top" style={{ zIndex: 1030 }}>
      <header className="text-white py-2" style={{ backgroundColor: AMAZON_NAV_BG }}>
        <div className="container-fluid px-2 px-lg-3">
          <div className="row align-items-center g-2 flex-column flex-md-row">
            {/* Left: Logo + delivery */}
            <div className="col-12 col-md-auto d-flex align-items-center gap-2 gap-md-3">
              <Link to="/" className="d-inline-block flex-shrink-0" style={{ maxWidth: 110 }}>
                <img
                  src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                  alt="amazon logo"
                  className="img-fluid"
                />
              </Link>

              <div className="d-flex align-items-center gap-1 px-2 py-1 rounded header-hover-item">
                <PlaceIcon fontSize="small" />
                <div className="lh-sm">
                  <p className="mb-0 small text-white-50" style={{ fontSize: "0.65rem" }}>
                    Delivered to
                  </p>
                  <span className="fw-semibold small">Israel</span>
                </div>
              </div>
            </div>

            {/* Center: Search */}
            <div className="col-12 col-md flex-grow-1">
              <div className="input-group input-group-sm">
                <select
                  name="category"
                  id="category"
                  className="form-select flex-shrink-0"
                  style={{ maxWidth: "11rem" }}
                  onChange={onCategoryChange}
                  defaultValue="all"
                >
                  <option value="all">All</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Amazon"
                  aria-label="Search Amazon"
                />
                <button
                  type="button"
                  className="btn border-0 rounded-0 px-3"
                  style={{ backgroundColor: AMAZON_SEARCH_BTN, color: "#111" }}
                  aria-label="Search"
                >
                  <SearchIcon />
                </button>
              </div>
            </div>

            {/* Right: Language, account, orders, cart */}
            <div className="col-12 col-md-auto">
              <div className="d-flex align-items-center justify-content-md-end flex-wrap gap-2 gap-md-3">
                <Link
                  to="/language"
                  className="d-none d-md-flex align-items-center gap-1 text-white text-decoration-none px-2 py-1 rounded header-hover-item"
                >
                  <img
                    src="https://flagcdn.com/w40/il.png"
                    alt="israel flag"
                    width="30"
                    height="20"
                    className="rounded"
                  />
                  <select
                    className="form-select form-select-sm border-0 bg-transparent text-white p-0"
                    style={{ width: "3.5rem", boxShadow: "none" }}
                    defaultValue=""
                    aria-label="Language"
                  >
                    <option value="">EN</option>
                  </select>
                </Link>

                {isAuthenticated ? (
                  <div className="dropdown">
                    <button
                      type="button"
                      className="btn btn-link text-white text-decoration-none d-flex flex-column lh-sm px-2 py-1 rounded header-hover-item dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span
                        className="text-white-50"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Hello, {displayName}
                      </span>
                      <span className="fw-semibold small">
                        Account &amp; Lists
                      </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow">
                      <li>
                        <span className="dropdown-item-text small text-muted">
                          {user.email}
                        </span>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/orders">
                          Your Orders
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={handleSignOut}
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-white text-decoration-none d-flex flex-column lh-sm px-2 py-1 rounded header-hover-item"
                  >
                    <span
                      className="text-white-50"
                      style={{ fontSize: "0.65rem" }}
                    >
                      Hello, sign in
                    </span>
                    <span className="fw-semibold small">
                      Account &amp; Lists
                    </span>
                  </Link>
                )}

                <Link
                  to="/orders"
                  className="text-white text-decoration-none d-flex flex-column lh-sm px-2 py-1 rounded header-hover-item"
                >
                  <span className="text-white-50" style={{ fontSize: "0.65rem" }}>
                    Returns
                  </span>
                  <span className="fw-semibold small">&amp; Orders</span>
                </Link>

                <Link
                  to="/cart"
                  className="text-white text-decoration-none position-relative d-inline-flex align-items-end px-2 py-1 rounded header-hover-item"
                >
                  <ProductionQuantityLimitsIcon fontSize="large" />
                  <span
                    className="position-absolute top-0 start-50 translate-middle-x fw-bold"
                    style={{ color: "#ff9900", fontSize: "0.875rem" }}
                  >
                    {itemCount}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <LowerHeader />
    </section>
  );
};

export default Header;
