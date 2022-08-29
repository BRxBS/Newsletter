import { GetStaticProps } from "next";
import { Head } from "next/document"; 
import React from "react";


import styles from "./styles.module.scss";

export default function Poost() {
  return (
    <>
      {/* <Head>
        <title>Posts | Newsletter</title>
      </Head> */}

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>creating a monoreppo</strong>
            <p>In this guide, you will learn how...</p>
          </a>

          <a href="#">
            <time>12 de março de 2021</time>
            <strong>creating a monoreppo</strong>
            <p>In this guide, you will learn how...</p>
          </a>

          <a href="#">
            <time>12 de março de 2021</time>
            <strong>creating a monoreppo</strong>
            <p>In this guide, you will learn how...</p>
          </a>
        </div>
      </main>
    </>
  );
}


import { SliceZone } from "@prismicio/react";

import { createClient } from "../../../prismicio";
import { components } from "../../../slices";


export const Page = ({ page }) => {
  return <SliceZone slices={page.data.slices} components={components} />;
};



export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData });

  const page = await client.getSingle("homepage");

  return {
    props: {
      page,
    },
  };
}