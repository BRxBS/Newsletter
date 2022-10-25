import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { Client as FaunaClient } from "faunadb"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

 const client = new FaunaClient({
  secret:  process.env.FAUNA_KEY,
  scheme: "http",
  domain: "localhost",
  port: 3000,
   });

export default NextAuth({
  session: {
    strategy: "jwt",
  },
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

  // adapter: FaunaAdapter(client),

  callbacks: {
//   jwt callback is only called when token is created
// async jwt({ token, user }) {
//   if (user) {
//     console.log('nextAuth - token - jwt', token)
//     token = user;
//     // token = user;
//     token.user=user
//   }
//   console.log('nextAuth - token - jwt - 2', token)
//   return Promise.resolve(token);
// },

// session: async ({ session, token }) => {
//   // session callback is called whenever a session for that particular user is checked
//  // in above function we created token.user=user
//  console.log('nextAuth - session', session)
//  console.log('nextAuth - token', token)

//   return Promise.resolve(session)
// },


     

    async signIn({ user}) {
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
