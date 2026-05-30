import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../compenents/Loader/Loader.jsx";
import { createOrder } from "../Api/ordersApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import classes from "./Auth/Auth.module.css";

const initialAddress = {
  fullName: "",
  phone: "",
  street: "",
  apt: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Israel",
};

function formatShippingAddress(fields) {
  const lines = [
    fields.fullName.trim(),
    fields.street.trim() + (fields.apt.trim() ? `, ${fields.apt.trim()}` : ""),
    `${fields.city.trim()}, ${fields.state.trim()} ${fields.postalCode.trim()}`,
    fields.country.trim(),
  ];
  if (fields.phone.trim()) {
    lines.push(`Phone: ${fields.phone.trim()}`);
  }
  return lines.filter(Boolean).join("\n");
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, refreshCart } = useCart();

  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  useEffect(() => {
    if (user?.fullName) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
      }));
    }
  }, [user?.fullName]);

  useEffect(() => {
    if (!loading && items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [loading, items.length, navigate]);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { orderId } = await createOrder({
        shippingAddress: formatShippingAddress(address),
      });
      await refreshCart();
      navigate(`/payment?orderId=${orderId}`, { replace: true });
    } catch (err) {
      setError(err.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && items.length === 0) {
    return <Loader />;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Checkout</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="h5 mb-1">Shipping address</h2>
              <p className="text-muted small mb-4">
                Enter where we should deliver your order.
              </p>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="checkout-address-form">
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-control"
                    autoComplete="name"
                    required
                    value={address.fullName}
                    onChange={onFieldChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    autoComplete="tel"
                    placeholder="+972 50 123 4567"
                    value={address.phone}
                    onChange={onFieldChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="street" className="form-label">
                    Street address
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    className="form-control"
                    autoComplete="address-line1"
                    required
                    placeholder="House number and street name"
                    value={address.street}
                    onChange={onFieldChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="apt" className="form-label">
                    Apt, suite, unit{" "}
                    <span className="text-muted fw-normal">(optional)</span>
                  </label>
                  <input
                    id="apt"
                    name="apt"
                    type="text"
                    className="form-control"
                    autoComplete="address-line2"
                    placeholder="Apartment 4B"
                    value={address.apt}
                    onChange={onFieldChange}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="form-control"
                      autoComplete="address-level2"
                      required
                      value={address.city}
                      onChange={onFieldChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">
                      State / region
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      className="form-control"
                      autoComplete="address-level1"
                      required
                      value={address.state}
                      onChange={onFieldChange}
                    />
                  </div>
                </div>

                <div className="row g-3 mt-0">
                  <div className="col-md-6">
                    <label htmlFor="postalCode" className="form-label">
                      ZIP / postal code
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      className="form-control"
                      autoComplete="postal-code"
                      required
                      value={address.postalCode}
                      onChange={onFieldChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      className="form-select"
                      autoComplete="country-name"
                      required
                      value={address.country}
                      onChange={onFieldChange}
                    >
                      <option value="Israel">Israel</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn mt-4 ${classes.submitBtn}`}
                  disabled={submitting}
                >
                  {submitting ? "Placing order…" : "Place your order"}
                </button>
              </form>

              <p className="small text-muted mt-3 mb-0">
                <Link to="/cart">Back to cart</Link>
              </p>
            </div>
          </div>
        </div>

        <aside className="col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h6 text-muted mb-3">Order summary</h2>

              <ul className="list-unstyled mb-3">
                {items.map((line) => (
                  <li
                    key={line.productId}
                    className="d-flex justify-content-between gap-2 mb-2 small"
                  >
                    <span>
                      {line.product.title}{" "}
                      <span className="text-muted">× {line.quantity}</span>
                    </span>
                    <span className="text-nowrap fw-semibold">
                      $
                      {(Number(line.product.price) * line.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <hr />

              <p className="d-flex justify-content-between mb-1">
                <span>
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <strong>${Number(total).toFixed(2)}</strong>
              </p>
              <p className="small text-muted mb-0">
                Payment is collected on the next step.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
