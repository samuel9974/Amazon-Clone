import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../compenents/Loader/Loader.jsx";
import {
  createPaymentIntent,
  devCompletePayment,
  getPaymentConfig,
} from "../Api/paymentsApi.js";
import { getOrderById } from "../Api/ordersApi.js";
import StripePaymentSection from "./Payment/StripePaymentSection.jsx";
import classes from "./Auth/Auth.module.css";

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [config, setConfig] = useState(null);
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [orderData, paymentConfig] = await Promise.all([
          getOrderById(orderId),
          getPaymentConfig(),
        ]);

        if (cancelled) return;

        setOrder(orderData);
        setConfig(paymentConfig);

        if (orderData.status === "PAID") {
          setPaid(true);
          return;
        }

        if (paymentConfig.stripeEnabled) {
          const intentData = await createPaymentIntent({
            orderId: Number(orderId),
          });
          if (!cancelled) {
            setIntent(intentData);
            if (intentData.status === "PAID") {
              setPaid(true);
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load payment details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleDevPay = async () => {
    setError("");
    setSubmitting(true);

    try {
      await devCompletePayment({ orderId: Number(orderId) });
      setPaid(true);
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripeSuccess = () => {
    setPaid(true);
    navigate(`/orders?paid=${orderId}`, { replace: true });
  };

  if (!orderId) {
    return <Navigate to="/checkout" replace />;
  }

  if (loading) {
    return <Loader />;
  }

  if (paid || order?.status === "PAID") {
    return (
      <div className="container py-4">
        <div
          className="card shadow-sm border-0 mx-auto text-center"
          style={{ maxWidth: 520 }}
        >
          <div className="card-body p-4">
            <h1 className="h4 text-success mb-3">Payment successful</h1>
            <p className="text-muted mb-4">
              Order <strong>#{orderId}</strong> is paid. Thank you for your
              purchase.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <Link to="/orders" className="btn btn-warning fw-semibold">
                View your orders
              </Link>
              <Link to="/" className="btn btn-outline-secondary">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error || "Order not found"}</div>
        <Link to="/orders">Back to orders</Link>
      </div>
    );
  }

  const publishableKey =
    config?.publishableKey ||
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    null;

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Payment</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Pay for order #{orderId}</h2>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              {config?.devMode && (
                <div>
                  <p className="text-muted small">
                    Development mode — no Stripe keys configured. Simulates a
                    successful payment locally.
                  </p>
                  <button
                    type="button"
                    className={`btn ${classes.submitBtn}`}
                    disabled={submitting}
                    onClick={handleDevPay}
                  >
                    {submitting ? "Processing…" : "Complete payment (dev)"}
                  </button>
                </div>
              )}

              {config?.stripeEnabled && intent?.clientSecret && (
                <StripePaymentSection
                  orderId={orderId}
                  clientSecret={intent.clientSecret}
                  publishableKey={publishableKey}
                  onSuccess={handleStripeSuccess}
                />
              )}

              {!config?.devMode && !config?.stripeEnabled && (
                <p className="text-danger mb-0">
                  Payments are not configured on the server. Add Stripe test keys
                  to backend <code>.env</code> or use development mode.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h6 text-muted mb-3">Order summary</h2>
              <p className="mb-2">
                <span className="badge text-bg-warning">{order.status}</span>
              </p>
              <p className="small text-muted mb-3">{order.shippingAddress}</p>

              <ul className="list-unstyled small mb-3">
                {order.items?.map((line) => (
                  <li
                    key={line.id}
                    className="d-flex justify-content-between gap-2 mb-2"
                  >
                    <span>
                      {line.productTitle}{" "}
                      <span className="text-muted">× {line.quantity}</span>
                    </span>
                    <span className="text-nowrap fw-semibold">
                      ${(line.unitPrice * line.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <hr />

              <p className="d-flex justify-content-between mb-0 fs-5 fw-bold">
                <span>Total</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Payment;
