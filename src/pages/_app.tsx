import { AppProps } from "next/app";
import React from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider as NextAuthProvider } from "next-auth/react";

import { Header } from "../components/Header";

import "../../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  // instanciando o client
  const client = new ApolloClient({
    uri: process.env.CONTENT_API,
    cache: new InMemoryCache(),
  });

  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          <Header />
          <Component {...pageProps} />
        </ApolloProvider>
      </NextAuthProvider>
    </>
  );
}

export default MyApp;
