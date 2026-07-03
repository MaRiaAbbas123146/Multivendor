const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cart: {
    type: Array,
    required: true
  },
  shippingAddress: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "processing"
  },
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String
    },
    type: {
      type: String
    }
  },
  paidAt: {
    typr: Date,
    default: Date.now()
  },
  deliverAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model("Order", orderSchema)