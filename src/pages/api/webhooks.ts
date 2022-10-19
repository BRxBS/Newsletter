import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { stripe } from "../../services/stripe";

import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Readable } from "node:stream";
import { saveSubscription } from "./_lib/manegeSubscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function (req: VercelRequest, res: VercelResponse) {

  
  // funciona mas não aparece o status 200 
  // e o evento esta decrepeted
 
    // if (req.method === "POST") {
    //   const payload = req.body
    //   const sig = req.headers['stripe-signature']
    //   const payloadString = JSON.stringify(payload, null, 2);
    //   const secret = 'webhook_secret';
    //   const header = stripe.webhooks.generateTestHeaderString({
    //           payload: payloadString,
    //           secret,
    //   });
      
    //   let event: Stripe.Event;
  
    //   // let event;
    //   try {
    //        event = stripe.webhooks.constructEvent(payloadString, header, secret);
     
    //   }catch (err) {
    //     res.status(400).send(`Webhook Error: ${err.message}`);
    //     return;
    //   }
  
    //   res.json({ received: true });
    // } else {
    //   res.setHeader("Allow", "POST");
    //   res.status(405).end("Method Not Allowed");
    // }
  

  }

  //   console.log('oi') 

  //   const { type } = event;
  //   console.log(' webhook type', type)

  //   if (relevantEvents.has(type)) {
  //     try {
  //       switch (type) {
  //         case "customer.subscription.created":
  //         case "customer.subscription.updated":
  //         case "customer.subscription.deleted":
  //           const subscription = event.data.object as Stripe.Subscription
    
  //                       await saveSubscription(
  //                         subscription.id,
  //                         subscription.customer.toString(),
  //                         type === "customer.subscription.created",
  //                       );

  //           break;


  //         case "checkout.session.completed":
  //           const checkoutSession = event.data
  //             .object as Stripe.Checkout.Session;
              
  //             await saveSubscription(
  //               checkoutSession.subscription.toString(),
  //               checkoutSession.customer.toString(),
  //               true
  //               );
  //               console.log("checkoutsession", checkoutSession);
  //           break;
  //         default:
  //           throw new Error("unhandled event");
  //       }
  //     } catch (err) {
  //       return res.json({ error: "Webhook handle failed." });
  //     }

  //     res.status(200).json({ received: true });
  //   } else {
  //     res.setHeader("Allow", "POST");
  //     res.status(405).end("Method Not Allowed");
  //   }
  // }


