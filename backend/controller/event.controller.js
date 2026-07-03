const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const ShopModel = require("../model/Shop.model");
const router = express.Router()
const Event = require("../model/event.model")
const { isSeller } = require("../middleware/auth");
const fs = require("fs")

// create event
router.post(
  "/create-event",
  upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;

      // FIX 2: validate shopId before hitting the DB
      if (!shopId) {
        return next(new ErrorHandler("Shop id is invalid", 404))
      }

      const shop = await ShopModel.findById(shopId)

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404))
      }

      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const eventData = req.body;
      eventData.images = imageUrls;
      eventData.shop = shop;

      const event = await Event.create(eventData)

      res.status(201).json({ success: true, event })

    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  }))

// get all events
// FIX 1: router.ger -> router.get
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find()
    // FIX 4: 201 -> 200 for GET
    res.status(200).json({ success: true, events })
  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
})

// get all events of a shop
router.get("/get-all-events/:id", catchAsyncErrors(async (req, res, next) => {
  try {
    const event = await Event.find({ shopId: req.params.id })
    // FIX 4: 201 -> 200 for GET
    res.status(200).json({ success: true, event })
  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}))

// delete event of a shop
router.delete("/delete-shop-event/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;

    // FIX 3: check existence BEFORE deleting so we don't wipe images for a non-existent event
    const eventData = await Event.findById(productId);

    if (!eventData) {
      return next(new ErrorHandler('Event not found with this id!', 404))
    }

    eventData.images.forEach((imageUrl) => {
      const filePath = `uploads/${imageUrl}`
      fs.unlink(filePath, (err) => {
        if (err) console.log(err);
      });
    })

    await Event.findByIdAndDelete(productId);

    // FIX 4: 201 -> 200 for DELETE
    res.status(200).json({
      success: true,
      message: "Event Deleted Successfully!"
    })

  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}))

module.exports = router;