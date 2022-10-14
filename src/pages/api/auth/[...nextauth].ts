import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "process";
import { getToken } from "next-auth/jwt";
import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { v4 as uuid } from "uuid";
import { Client as FaunaClient } from "faunadb"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

 const client = new FaunaClient({
   secret: process.env.FAUNA_KEY,
   scheme: "http",
   domain: "localhost",
   port: 3000,
   });

export default NextAuth({
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  // adapter: FaunaAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  adapter: FaunaAdapter(client),
  callbacks: {




    async signIn({ user, account, profile, credentials }) {
      const { email } = user;
      try {
        if (account.provider === "google") {
          return profile.email_verified && profile.email.endsWith("@gmail.com")
        }
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
