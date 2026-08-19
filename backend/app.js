require('dotenv').config();
const express = require("express");
const ErrorHandler = require("./middleware/Error.js");
const app = express();
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");

const cors = require("cors")

app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/", express.static("uploads"))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

//import routes
const user = require("./controller/User.controller");
const shop = require("./controller/Shop.controller");
const product = require("./controller/product.controller");
const event = require("./controller/event.controller")
const coupoun = require("./controller/couponCode.controller")
const payment = require("./controller/payment.controller")
const order = require("./controller/order.controller")
const conversation = require("./controller/conversation.controller")
const message = require("./controller/messages.controller.js")
const withdraw = require("./controller/withdraw.controller.js")

app.use("/api/v2/conversation", conversation)
app.use("/api/v2/message", message)
app.use("/api/v2/user", user)
app.use("/api/v2/order", order)
app.use("/api/v2/shop", shop)
app.use("/api/v2/product", product)
app.use("/api/v2/event", event)
app.use("/api/v2/coupoun", coupoun)
app.use("/api/v2/payment", payment)
app.use("/api/v2/withdraw", withdraw);

//it's for errorhandling
app.use(ErrorHandler);

module.exports = app;