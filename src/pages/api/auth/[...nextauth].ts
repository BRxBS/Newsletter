import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { env } from "process";

import { query } from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          // I wish to request additional permission scopes.
          scope: "read-user",
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
        const {email} = user
      try {
        await fauna.query(
         query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index("user_by_email"),
                  query.Casefold(user.email)
                )
              )
            ),
            query.Create(query.Collection("users"),
             { data: { email } }
            ),
           query.Get(
              query.Match(
                query.Index("user_by_email"),
                query.Casefold(user.email)
              )
            )
          )
        );
        
        
        return true;
      } catch {
        return false;
      }
    },
  },
});
