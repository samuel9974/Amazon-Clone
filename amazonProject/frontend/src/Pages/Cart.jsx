import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../compenents/Loader/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const { cart, loading, error, changeQuantity, removeItem } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  const handleChangeQty = async (productId, currentQty, delta) => {
    setUpdatingId(productId);
    try {
      await changeQuantity(productId, currentQty, delta);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    try {
      await removeItem(productId);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && items.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Shopping Cart</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-5">
          <p>Your Amazon Cart is empty.</p>
          <Link to="/" className="btn btn-warning">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {items.map((line) => {
              const product = line.product;
              const busy = updatingId === line.productId;

              return (
                <div
                  key={line.productId}
                  className="card mb-3 shadow-sm border-0"
                >
                  <div className="card-body row align-items-center g-3">
                    <div className="col-auto">
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="col">
                      <Link
                        to={`/products/${product.id}`}
                        className="fw-semibold text-decoration-none text-dark"
                      >
                        {product.title}
                      </Link>
                      <p className="mb-1 mt-2 fw-bold">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <span className="small text-muted">Qty:</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          disabled={busy}
                          onClick={() =>
                            handleChangeQty(line.productId, line.quantity, -1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-2 fw-semibold">{line.quantity}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          disabled={
                            busy || line.quantity >= (product.stock ?? 999)
                          }
                          onClick={() =>
                            handleChangeQty(line.productId, line.quantity, 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 mt-2"
                        disabled={busy}
                        onClick={() => handleRemove(line.productId)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="col-auto text-end fw-bold">
                      $
                      {(Number(product.price) * line.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <p className="mb-2">
                  Subtotal ({itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"}):
                </p>
                <strong className="fs-4 d-block mb-3">
                  ${Number(total).toFixed(2)}
                </strong>
                <Link to="/checkout" className="btn btn-warning w-100 fw-bold">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
