const express = require("express");
const router = express.Router()
const catchAsyncErrors = require("../middleware/catchAsyncErrors")

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

Router.post("/payment/process", catchAsyncErrors(async (req, res, next) => {

  const myPayment = await stripe.paymentIntents.create({
    amount: req.amount,
    currency: "RPS",
    metadata: {
      comapny: "Becodemy"
    }
  })
  res.status(201).json({
    success: true,
    client_secret: myPayment.client_secret
  })

})
)
router.get("/stripeapikey", catchAsyncErrors(async (req, res, next) => {
  res.status(200).jsom({ stripeApikey: process.nextTick.STRIPE_API_KEY })
}))

module.exports = router;