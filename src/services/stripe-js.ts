// stripe no front-end
import { loadStripe} from '@stripe/stripe-js'


let stripePromisse = null

export async function getStripeJs(){

    if (!stripePromisse) {
        stripePromisse = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    }


    return stripePromisse
}