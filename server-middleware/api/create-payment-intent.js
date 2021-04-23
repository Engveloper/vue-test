import fetch from 'node-fetch'
import querystring from 'querystring'

export default async (req, res) => {
  const { body } = req
  console.log(req.query)
  console.log(body)

  const data = Object.assign(body, {
    amount: body.amount * 100,
    'payment_method_types[]': 'card'
  })

  try {
    const stripeResponse = await fetch(
      'https://api.stripe.com/v1/payment_intents',
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_CLIENT_SECRET}`,
          'Content-Type': `application/x-www-form-urlencoded`
        },
        method: 'POST',
        body: querystring.stringify(data)
      }
    )
    const jsonResponse = await stripeResponse.json()
    if (jsonResponse.error) {
      throw new Error(jsonResponse.error.message)
    }

    res.json(jsonResponse)
  } catch (error) {
    res.status(200).json({ error: error.message })
  }
}
