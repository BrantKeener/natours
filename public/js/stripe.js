/* eslint-disable */

import axios from 'axios'
import { showAlerts } from './alerts'
const stripe = Stripe('pk_test_RxQGHQvEkJjGFGw6bh8Pyvv100IjOFlTaN')

export const bookTour = async tourId => {
  // 1) Get session from server
  try {
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`)
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (err) {
    console.log(err)
    showAlerts('error', err)
  }
}
