const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const ShopModel = require("../model/Shop.model");
const router = express.Router()
const { isSeller } = require("../middleware/auth");
const couponCodeModel = require("../model/couponCode.model");


//create coupomn code
router.post("/create-coupon-code", isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCoupounCodeExists = await couponCodeModel.find({ name: req.body.name })

      if (isCoupounCodeExists) {
        return next(new ErrorHandler("Coupon code already existed", 400))
      }

      const coupounCode = await couponCodeModel.create(req.body)

      res.status(201).json({
        success: true,
        coupounCode
      })

    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  }))


//get all coupoun codes of a shop

router.get("/get-coupoun/:id", isSeller, catchAsyncErrors(async (req, res, next) => {

  try {

    const coupounCodes = await couponCodeModel.find({
      shop: {
        _id: req.params.id
      }
    })

    res.status(201)

  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}))

//delete all coupouns of a shop
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await couponCodeModel.findByIdAndDelete(req.params);

      if (!couponCode) {
        return next(new ErrorHandler("Copoun code does not exists", 400))
      };
      res.status(201).json({
        success: true,
        message: "Copoun code deleted successfully"
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400))
    }
  })
)

//get coupoun code value by its namew
router.get("/get-coupon-value/:name", catchAsyncErrors(async (req, res, next) => {

  try {
    const couponCode = await couponCodeModel.findOne({ name: req.params.name });

    res.status(200).json({
      success: true,
      couponCode
    });

  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }

}))

module.exports = router;