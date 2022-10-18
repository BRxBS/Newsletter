import Head from "next/head";
import React from "react";
import { gql } from "@apollo/client";
import { client } from "../../services/apollo";
import Link from "next/link";

import styles from "./styles.module.scss";

export async function getStaticProps() {
  const { data: post } = await client.query({
    query: gql`
      query MyQuery {
        posts {
          slug
          title
          createdAt
          content
          id
        }
      }
    `,
  });
  // console.log(post);
  const { posts } = post;
  
  return {
    props: {
      posts,
    },
  };
}

export default function Post({ posts }) {
  // console.log("dentro", posts);

  return (
    <>
      <Head>
        <title>Posts | Newsletter</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((outro) => (
            <Link href={`/posts/${outro.slug}`}>
            <a key={outro.id} >
              {new Date(outro.createdAt).toLocaleDateString(
                'pt-BR', {
                  day: '2-digit',
                  month:'long',
                  year:'numeric'
                }
                )}
              <strong>{outro.title}</strong>
              <p>{outro.content}</p>
            </a>
                </Link>
          ))}
        </div>
      </main>
    </>
  );
}
