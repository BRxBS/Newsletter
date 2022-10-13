import { GetServerSideProps } from "next"
import React from "react"
import { client } from "../../services/apollo"
import { gql } from '@apollo/client';
import Head from "next/head";
import { getSession } from "next-auth/react";


import styles from "./post.module.scss";

// interface PostServerSideProps {
//   posts: {
//     slug: string;
//     title: string;
//     createdAt: string;
//     content: string;
//   };
// }
export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const session = await getSession({req})
  console.log('session',session)
    const { data: post } = await client.query({
        query: gql`
      query MyQuery($slug: String!) {
        posts(where: {slug: $slug}) {
          slug
          title
          createdAt
          content
          id
        }
      }
    `, variables:{slug: params.slug}
  });
  // console.log(post);
  const { posts } = post;
  
  return {
      props: {
          posts,
        },
    };
}

export default function Post({posts}){
    // console.log('dentro ',posts)
    return (
      <>
        <Head>
          <title> | Newsletter</title>
        </Head>

        {posts.map((posts) => (
          <main className={styles.container}>
            <article className={styles.post}>
              <h1>{posts.title}</h1>
              <time>
                {new Date(posts.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <div className={styles.postContent}>{posts.content}</div>
            </article>
          </main>
        ))}
      </>
    );
}



  
// export async function getStaticPaths(){
//     const { data: post } = await client.query({
//     query: gql`
//       query MyQuery {
//         posts {
//           slug
//         }
//       }
//     `,
//   });
//   const { posts } = post;
//   const paths = posts.map(post => ({
//     params: {slug: post.slug}
//   }))
//   console.log(paths)
//   return {paths, fallback: false};

// }