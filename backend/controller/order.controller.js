const express = require("express")
const router = express.Router()
const ErrorHandler = require("../utils/ErrorHandler.js")
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const { isAuthenticated, isSeller } = require("../middleware/auth.js")
const Order = require("../model/order.model.js")
const product = require("../model/product.model.js");
const { trusted } = require("mongoose");

router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),

  //get all orders of users
  router.get("/get-all-orders/:userId", catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = (await Order.find({ "user._id": req.params.userId })).sort({
        createdAt: -1
      });

      res.status(200).json({
        success: true,
        orders,
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })),

  //get all orders of seller
  router.get("/get-seller-all-orders/:userId", catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = (await cart.find({ "user._id": req.params.userId })).sort({
        createdAt: -1
      });

      res.status(200).json({
        success: true,
        orders,
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })),

  //update order status for seller
  router.put("/update-order-status/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty)
        })
      }

      order.status = req.body.status;
      if (req.body.status === "Delivered") {
        order.deliverAt = Date.now()
        order.paymentInfo.status = "Succeeded";
      }

      await order.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        order
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        product.stock -= qty;
        product.sold_out += qty;
        await order.save({ validateBeforeSave: false });
      }

    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })),

  //Give a refund...for user

  router.put("/order-refund/:id", catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }


      order.status = req.body.status;


      await order.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Successfully!"
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })),

  //accepts the refund...seller

  router.put("/order-refund-success/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id)

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400))
      }

      order.status = req.body.status;
      await order.save()
      res.status(200).json({
        success: true,
        message: "Order Refund Successfully!"
      })

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty)
        })
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        product.stock += qty;
        product.sold_out -= qty;
        await order.save({ validateBeforeSave: false });
      }


    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }))
);

