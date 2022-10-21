
                    import Stripe from "stripe";
                    import { stripe } from "../../services/stripe";
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
                            const vari = 'vindo do webhook'
                            console.log("checkoutsession- subscription", checkoutSession.subscription);
                            console.log("checkoutsession- customer", checkoutSession.customer);
                            
                          
                              await saveSubscription(
                            
                                checkoutSession.subscription.toString(),
                                checkoutSession.customer.toString(),
                                // vari

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
                      console.log('true')
                    } else {
                      res.setHeader("Allow", "POST");
                      res.status(405).end("Method Not Allowed");
                      console.log('else - 2')
                    }
                  }
                
            




