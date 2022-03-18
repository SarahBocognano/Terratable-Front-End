import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckOutForm } from "./CheckOutFrom";
import "../styles/stripe.css";

const PUBLIC_KEY =
  "pk_test_51KdyjxLztupzaYHvTC8gD1FoavJHbkBfllkWk2P36E7Uzqmmi43Dmr0PIogtKm9Bp4tkuk99MmBRJplXCm6LpIIM00xc1l1MdX";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckOutForm />
    </Elements>
  );
};

export default Stripe;
