import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import "../styles/stripe.css";

export const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      console.log("Token Généré: ", paymentMethod);
      //evoi du token au backend
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:3002/paiement", {
          amount: 100,
          id: id,
        });
        console.log(response);
        if (response.data.success) console.log("Paiement réussi");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <div>
      <form className="formPaiement" onSubmit={handleSubmit}>
        <h1> Informations de paiement</h1>
        <div className="cardAndButton">
          <CardElement
            options={{
              hidePostalCode: true,
            }}
          />
          <button className="buttonPaiement">Payer</button>
        </div>
      </form>
    </div>
  );
};
