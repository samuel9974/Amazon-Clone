import React, { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { confirmPayment } from "../../Api/paymentsApi.js";
import classes from "../Auth/Auth.module.css";

function StripeCheckoutForm({ orderId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError("");
    setSubmitting(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          redirect: "if_required",
        },
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        await confirmPayment({
          orderId: Number(orderId),
          paymentIntentId: paymentIntent.id,
        });
        onSuccess();
        return;
      }

      throw new Error("Payment was not completed. Please try again.");
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      <PaymentElement />
      <button
        type="submit"
        className={`btn w-100 mt-3 ${classes.submitBtn}`}
        disabled={!stripe || submitting}
      >
        {submitting ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}

export default function StripePaymentSection({
  orderId,
  clientSecret,
  publishableKey,
  onSuccess,
}) {
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  );

  if (!publishableKey || !clientSecret) {
    return (
      <p className="text-danger small mb-0">
        Stripe is enabled but publishable key or client secret is missing.
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <StripeCheckoutForm orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  );
}
