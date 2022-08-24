import { GetStaticProps, GetStaticPropsResult } from "next";
import React from "react";
import Head from "next/head";

import styles from "./home.module.scss";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>News Letter</title>
      </Head>

      <main className={styles.contetContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>...</span> world.
          </h1>

          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/Mulher.svg" alt="girl coding" />
      </main>
    </>
  );
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<HomeProps>> {
  const price = await stripe.prices.retrieve("price_1LaIPiKhhmuslvA1UiMgTJKf", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
