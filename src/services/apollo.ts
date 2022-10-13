import { ApolloClient, InMemoryCache } from "@apollo/client";


export const client = new ApolloClient({
  uri: "https://api-sa-east-1.hygraph.com/v2/cl7ghz0vr831301uh568edett/master",
  cache: new InMemoryCache(),
});