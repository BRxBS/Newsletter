import { fauna } from "../../../services/fauna";
import { query } from "faunadb";
import { stripe } from "../../../services/stripe";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

type User = {
    ref: {
      id: string;
    };
    data: {
        stripe_customer_id: string;
    };
}


export async function  saveSubscription(
    subscriptionId: string,
    customerId: String,
    createAction = true,
 ){
//     console.log(vari)
//   console.log('subscriptionId', subscriptionId)
//  console.log('customerId', customerId)
                                                                                                          
console.log('depois session')
// const session = await getSession()
//       console.log('session-webhook', session)

const user = await fauna.query<User>(
        query.Get(
            query.Match(
                query.Index('user_by_stripe_customer_id'),
                query.Casefold(customerId)
            )
        )
    )
    console.log('manegeSub - user fauna', user)



    const userRef =  await fauna.query<User>(
        query.Select(
            query.Ref(query.Collection("users"), user.ref.id),
            query.Get(
                query.Match(
                    query.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )
    console.log('customerId- sub', customerId)
    console.log('user.ref.id', user.ref.id)

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    console.log('const subscription ', subscription)

  
    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }
    if (createAction) {
    await fauna.query(
      query.Create(query.Collection("subscriptions"), {
        data: subscriptionData,
      })
    );
} else{
        await fauna.query(
          query.Replace(
            query.Select(
                user.ref.id,
              query.Get(
                query.Match(
                    query.Index("subscription_by_id"),
                    subscriptionId,
                 )
              )
            ),
            {data: subscriptionData}
          )
        );
}
    
    await fauna.query(
        query.Update(query.Ref(query.Collection("subscriptions"), user.ref.id), {
          data: {subscriptionData},
        })
      );
//  

// console.log('user ', user)

//     const userRef =  await fauna.query<User>(
//         query.Select(
//             query.Ref(query.Collection("users"), user.ref.id),
//             query.Get(
//                 query.Match(
//                     query.Index('user_by_stripe_customer_id'),
//                     customerId
//                 )
//             )
//         )
//     )
//     console.log('userRef ', userRef)

//     const subscription = await stripe.subscriptions.retrieve(subscriptionId)
//     console.log('const subscription ', subscription)

//     const subscriptionData = {
//         id: subscription.id,
//         userId: userRef,
//         status: subscription.status,
//         price_id: subscription.items.data[0].price.id
//     }
//     console.log('subscriptionData', subscriptionData)

//     await fauna.query(
//       query.Create(
//         query.Collection('subscriptions'),
//         {data: subscriptionData}
//       )
//     )




//     console.log("subscriptionData", subscriptionData);

// if (createAction) {
//     await fauna.query(
//       query.Create(query.Collection("subscriptions"), {
//         data: subscriptionData,
//       })
//     );
// } else{
//         await fauna.query(
//           query.Replace(
//             query.Select(
//               "ref",
//               query.Get(
//                 query.Match(
//                     query.Index("subscription_by_id"),
//                     subscriptionId,
//                  )
//               )
//             ),
//             {data: subscriptionData}
//           )
//         );
// }
}
    