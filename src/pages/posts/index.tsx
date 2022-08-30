import { GetStaticProps } from "next";
import { Head } from "next/document"; 
import React from "react";


import styles from "./styles.module.scss";

export default function Post() {
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
// it doesn't work

import { SliceZone } from "@prismicio/react";

import { createClient } from "../../../prismicio";
import { components } from "../../../slices";
import sm from "../../../sm.json"
import * as prismic from '@prismicio/client'


export const Page = ({ page }) => {
  return <SliceZone slices={page.data.slices} components={components} />;
};




export async function getStaticProps({ previewData }) {
 const client = createClient({ previewData });

  const page = await client.getSingle("Post");

  return {
    props: {
      page,
    },
  };
}
