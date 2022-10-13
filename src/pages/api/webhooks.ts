import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Readable } from "node:stream";
import { saveSubscription } from "./_lib/manegeSubscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signatures"];
    console.log('const secret', secret)

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(err);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;
    console.log('type', type)

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription
    
                        await saveSubscription(
                          subscription.id,
                          subscription.customer.toString(),
                          type === "customer.subscription.created",
                        );

            break;


          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
              
              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer.toString(),
                true
                );
                console.log("checkoutsession", checkoutSession);
            break;
          default:
            throw new Error("unhandled event");
        }
      } catch (err) {
        return res.json({ error: "Webhook handle failed." });
      }

      res.status(200).json({ received: true });
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  }
}

