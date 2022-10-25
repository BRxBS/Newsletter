  import Stripe from "stripe";
  import { stripe } from "../../services/stripe";
  import { fauna } from "../../services/fauna";
  import { query } from "faunadb";
  import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
  import type { VercelRequest, VercelResponse } from "@vercel/node";
  import type { Readable } from "node:stream";
  import { saveSubscription } from "./_lib/manegeSubscription";

                    async function buffer(readable: Readable) {
                    const chunks = [];
                    for await (const chunk of readable) {
                    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
                    }
                    return Buffer.concat(chunks);
                    }
        

                    export const config = {
                      api: {
                        bodyParser: false,
                      },
                    };

                   

                    const relevantEvents = new Set([
                      "checkout.session.completed",
                      "customer.subscription.created",
                      "customer.subscription.updated",
                      "customer.subscription.deleted",
                    ]);



export default async function (req: VercelRequest, res: VercelResponse, event: Stripe.Event) {



          if (req.method === "POST") {
            const buf = await buffer(req);
            const sig = req.headers['stripe-signature']
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        
        
            // console.log('sig', sig)
            // console.log('buf', buf)

              
            // let event;

            try {
              event = stripe.webhooks.constructEvent(
                buf.toString(),
                sig,
                webhookSecret);
                // console.log('event', event)

            }catch (err) {
              res.status(400).send(`Webhook Error: ${err.message}`);
              console.log('chatch')
              return;
            }
            
      
          } else {
            res.setHeader("Allow", "POST");
            res.status(405).end("Method Not Allowed");
            console.log('else')
          }         


          // if (event.type === "charge.succeeded") {
          //   const charge = event.data.object;
          //   // Handle successful charge
          // } else {
          //   console.warn(`Unhandled event type: ${event.type}`);
          // }
          
      const { type } = event;
      // console.log('event', event)

      if (relevantEvents.has(type)) {
        // console.log('evento recebido', event)
        try {
            console.log('evento recebido no try')
          switch (type) {
            
            // case "customer.subscription.created":
            // // case "customer.subscription.updated":
            // // case "customer.subscription.deleted": 
            // const subscription = event.data.object as Stripe.Subscription

            //               await saveSubscription(
            //                 subscription.id,
            //                 subscription.customer.toString(),
            //                 type === "customer.subscription.created",
            //               );
            //               console.log("subscription", subscription);

            //   break;
            case "checkout.session.completed":
            
              const checkoutSession = event.data.object as Stripe.Checkout.Session;
              console.log("checkoutsession- subscription", checkoutSession.subscription);
              console.log("checkoutsession- customer", checkoutSession.customer);

              // await function saveSub(req: NextApiRequest, subscriptionId: string, customerId: string, createAction: boolean){
                
      
                 
              
              //         console.log('dentro de query')
                      
              //         async function essa() {
              //            console.log("subscriptionId- subscription", subscriptionId);
              //            console.log("customerId- subscription", customerId);

              //           const session = await getSession({req})
              //           console.log('session-webhook', session)
                      
              //           const userRef = await fauna.query(
              //             query.Select(
              //                 'ref',
              //                 query.Get(
              //                     query.Match(
              //                         query.Index('user_by_stripe_customer_id'),
              //                         customerId
              //                     )
              //                 )
              //             )
              //         )
              //         console.log('userRef', userRef)
                
                  
              //         const subscription =  await stripe.subscriptions.retrieve(subscriptionId)
              //         console.log('subscriptions.retrive', subscription)
                  
              //         const subscriptionData = {
              //             id: subscription.id,
              //             userId: userRef,
              //             status: subscription.status,
              //             price_id: subscription.items.data[0].price.id 
              //         }
              //         if (createAction) {
              //           await fauna.query(
              //             query.Create(query.Collection("subscriptions"), {
              //               data: subscriptionData,
              //             })
              //           );
              //       } else{
              //               await fauna.query(
              //                 query.Replace(
              //                   query.Select(
              //                     "ref",
              //                     query.Get(
              //                       query.Match(
              //                           query.Index("subscription_by_id"),
              //                           subscriptionId,
              //                       )
              //                     )
              //                   ),
              //                   {data: subscriptionData}
              //                 )
              //               );
              //       }
              //         }
              //         essa()
                    
              //     }
                 
              
              
                await saveSubscription(
                
                
                  checkoutSession.subscription.toString(),
                  checkoutSession.customer.toString(),
                  true
                  );
                  console.log("fez o case");
                  console.log("checkoutsession", checkoutSession);

              break;
            default:
              throw new Error("unhandled event");
          }
        } catch (err) {
          console.log('catch - 2')
          return res.json({ error: "Webhook handle failed." });
          
        }

        res.status(200).json({ received: true });
        console.log('res.status(200) - true')
      } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
        console.log('else - 2')
      }
    }
  





