                    // import { NextApiRequest, NextApiResponse } from "next";

                    // export default (req: NextApiRequest, res: NextApiResponse) => {
                    //   console.log('evento recebido')

                    //   res.status(200).json({ok: true})
                    // }
                    import Stripe from "stripe";
                    import { stripe } from "../../services/stripe";
                    import type { VercelRequest, VercelResponse } from "@vercel/node";
                    import type { Readable } from "node:stream";
                    import { saveSubscription } from "./_lib/manegeSubscription";

                    // export const config = {
                    // api: {
                    // bodyParser: false,
                    // },
                    // };

                    async function buffer(readable: Readable) {
                    const chunks = [];
                    for await (const chunk of readable) {
                    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
                    }
                    return Buffer.concat(chunks);
                    }
                    // const relevantEvents = new Set([
                    // "checkout.session.completed",
                    // "customer.subscription.created",
                    // "customer.subscription.updated",
                    // "customer.subscription.deleted",
                    // ]);


                    // export default async function (req: VercelRequest, res: VercelResponse) {
                    // if (req.method === "POST") {
                    // const buf = await buffer(req);
                    // const secret = req.headers["stripe-signatures"];
                    // console.log('const secret', secret)

                    // let event: Stripe.Event;
                    // console.log('event', event)

                    // try {
                    //   event = stripe.webhooks.constructEvent(
                    //     buf,
                    //     secret,
                    //     process.env.STRIPE_WEBHOOK_SECRET
                    //   );
                    // } catch (err) {
                    //   console.log(err);
                    //   return res.status(400).send(`Webhook error: ${err.message}`);
                    // } }}

                


                    // import { NextApiRequest, NextApiResponse } from "next";
                    // import Stripe from "stripe"
                    // import { stripe } from "../../services/stripe";

                    // import type { VercelRequest, VercelResponse } from "@vercel/node";
                    // import type { Readable } from "node:stream";
                    // import { saveSubscription } from "./_lib/manegeSubscription";

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

                        if (req.method === "POST") {
                          const buf = await buffer(req);
                          const sig = req.headers['stripe-signature']
                          const payloadString = JSON.stringify(buf , null, 2);
                          const secret = webhookSecret;
                          const header = stripe.webhooks.generateTestHeaderString({
                                  payload: payloadString,
                                  secret,
                          });
                      
                          console.log('sig', sig)
                          console.log('buf', buf)

                          let event: Stripe.Event;
                           

                          // let event;
                          try {
                              event = stripe.webhooks.constructEvent(payloadString, header, secret);

                          }catch (err) {
                            res.status(400).send(`Webhook Error: ${err.message}`);
                            return;
                          }
                          console.log('event', event)
                          res.json({ received: true });
                        } else {
                          res.setHeader("Allow", "POST");
                          res.status(405).end("Method Not Allowed");
                        }

                        

                      }

                    //     console.log('oi') 

                //     const { type } = event;
                //     console.log(' webhook type', type)

                //     if (relevantEvents.has(type)) {
                //       try {
                //         switch (type) {
                //           case "customer.subscription.created":
                //           case "customer.subscription.updated":
                //           case "customer.subscription.deleted":
                //             const subscription = event.data.object as Stripe.Subscription

                //                         await saveSubscription(
                //                           subscription.id,
                //                           subscription.customer.toString(),
                //                           type === "customer.subscription.created",
                //                         );

                //             break;


                //           case "checkout.session.completed":
                //             const checkoutSession = event.data
                //               .object as Stripe.Checkout.Session;
                          
                //               await saveSubscription(
                //                 checkoutSession.subscription.toString(),
                //                 checkoutSession.customer.toString(),
                //                 true
                //                 );
                //                 console.log("checkoutsession", checkoutSession);
                //             break;
                //           default:
                //             throw new Error("unhandled event");
                //         }
                //       } catch (err) {
                //         return res.json({ error: "Webhook handle failed." });
                //       }

                //       res.status(200).json({ received: true });
                //     } else {
                //       res.setHeader("Allow", "POST");
                //       res.status(405).end("Method Not Allowed");
                //     }
                //   }
                // }





