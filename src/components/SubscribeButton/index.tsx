import { signIn, useSession } from "next-auth/react";
import React from "react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./styles.module.scss";

interface SubscribeButton {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButton) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("google");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
      >
        Subscribe Now
      </button>
    </>
  );
}