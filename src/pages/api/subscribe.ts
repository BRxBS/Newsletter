import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";
import { query } from "faunadb";
import { fauna } from "../../services/fauna";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };

};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST') {
        const session = await getSession({req})
        console.log('session-subscribe', session)
      

        const user = await fauna.query<User>(
            query.Get(
                query.Match(
                    query.Index('user_by_email'),
                    query.Casefold(session.user.email)
                )
            )
        )
        console.log('user fauna',user)

        
        let customerId = user.data.stripe_customer_id;
        
        
        if(!customerId){


         const stripeCustomer =  await stripe.customers.create({
                email: session.user.email,
                //metadata
            })
            // console.log("stripeCustomer", stripeCustomer);


           await fauna.query(
             query.Update(query.Ref(query.Collection("users"), user.ref.id), {
               data: {
                 stripe_customer_id: stripeCustomer.id,
               },
             })
           );

           customerId = stripeCustomer.id
           console.log('subscribe - customerID', customerId)
           console.log('subscribe -  user.ref.id', user.ref.id)
          }
            

        const stripeCheackoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          billing_address_collection: "required",
          line_items: [
            { price: "price_1LaIPiKhhmuslvA1UiMgTJKf", quantity: 1 }
          ],
          mode: "subscription",
          allow_promotion_codes: true,
          success_url: process.env.STRIPE_SUCCESS_URL,
          cancel_url: process.env.STRIPE_CANCEL_URL,
        });
        // console.log("stripeCheackoutSession", stripeCheackoutSession);
        return res.status(200).json({ sessionId: stripeCheackoutSession.id});
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}