import React from 'react'
import Head from 'next/head'

import styles from "./home.module.scss";
import { SubscribeButton } from '../components/SubscribeButton';

export default function Home() {
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
            <span>for $9.90 month</span>
          </p>
          <SubscribeButton/>
        </section>
        <img src="/Mulher.svg" alt="girl coding" />
      </main>
    </>
  );
}
