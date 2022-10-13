import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { env } from "process";
import { getToken } from "next-auth/jwt";
import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { v4 as uuid } from "uuid";
import { Client as FaunaClient } from "faunadb"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

// const client = new FaunaClient({
//   secret: process.env.FAUNA_KEY,
//   scheme: "http",
//   domain: "localhost",
//   port: 3000,
// });

export default NextAuth({
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  // adapter: FaunaAdapter(client),
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
    // async jwt({ token, account }) {
    //   // Persist the OAuth access_token to the token right after signin
    //   if (account) {
    //     token.accessToken = account.access_token
    //   }
    //   return token
    // },
     async session( {session }) {
      session.user.email
      const userActiveSubscription = await fauna.query(
        query.Get(
            query.Match(
              query.Index('subscription_by_user_ref'),
              query.Select(
                'ref',
                query.Get(
                  query.Match(
                    query.Index('user_by_email'),
                    query.Casefold(session.user.email)
                  )
                )
              )
            )
        )
      )
       return session;
     },

    async signIn({ user, account, profile, credentials }) {
      const { email } = user;
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
            query.Create(query.Collection("users"), { data: { email } }),
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
