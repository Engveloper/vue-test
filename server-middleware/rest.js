import express from 'express'

import createPaymentIntent from './api/create-payment-intent'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/create-payment-intent', createPaymentIntent)

module.exports = app
