import React from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useCategoriesContext } from "../Category/CategoriesProvider.jsx";

/**
 * LowerHeader.jsx - Secondary Navigation Menu (Bootstrap 5)
 */

const AMAZON_LOWER_BG = "#232f3e";

const LowerHeader = () => {
  const { categories } = useCategoriesContext();

  return (
    <nav className="text-white py-1" style={{ backgroundColor: AMAZON_LOWER_BG }}>
      <div className="container-fluid px-2 px-lg-3">
        <ul className="nav flex-nowrap overflow-auto gap-1 small mb-0 py-1">
          <li className="nav-item">
            <Link
              to="/"
              className="nav-link text-white d-flex align-items-center gap-1 py-1 px-2 rounded header-hover-item"
            >
              <MenuIcon fontSize="small" />
              <span className="mb-0">All</span>
            </Link>
          </li>

          {categories.map((cat) => (
            <li key={cat.slug} className="nav-item d-none d-sm-block">
              <Link
                to={`/category/${cat.slug}`}
                className="nav-link text-white py-1 px-2 rounded header-hover-item"
              >
                {cat.name}
              </Link>
            </li>
          ))}

          <li className="nav-item d-none d-sm-block">
            <span className="nav-link text-white py-1 px-2 rounded header-hover-item">
              Today&apos;s Deals
            </span>
          </li>
          <li className="nav-item d-none d-sm-block">
            <span className="nav-link text-white py-1 px-2 rounded header-hover-item">
              Customer Service
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default LowerHeader;
