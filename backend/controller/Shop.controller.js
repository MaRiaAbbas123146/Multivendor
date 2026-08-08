const express = require("express")
const path = require("path")
const router = express.Router()
const fs = require("fs")
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const sendShopToken = require("../utils/sendShopToken.js");
const { isAuthenticated, isSeller } = require("../middleware/auth.js")
const ShopModel = require("../model/Shop.model.js")
const ErrorHandler = require("../utils/ErrorHandler.js")

// ✅ Removed multer import since we're using base64

// router.post("/shop-create", async (req, res, next) => {  // ✅ Fixed req, res order
//   try {
//     const { email, name, password, phoneNumber, address, zipCode, avatar } = req.body;

//     if (!email || !name || !password) {
//       return next(new ErrorHandler("Please fill all required fields", 400));
//     }

//     const sellerEmail = await ShopModel.findOne({ email });
//     if (sellerEmail) {
//       return res.status(400).json({ success: false, message: "Seller already exists" });
//     }

//     const seller = {
//       name,
//       email,
//       password,
//       avatar,  // base64 string
//       address,
//       phoneNumber,
//       zipCode
//     };

//     const activationToken = createActivationToken(seller);
//     const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

//     try {
//       await sendMail({
//         email: seller.email,
//         subject: "Activate Your Shop Account",
//         message: `Hello ${seller.name}, please click the link to activate your shop account: ${activationUrl}`,
//       });

//       res.status(201).json({
//         success: true,
//         message: `Please check your email: ${seller.email} to activate your account`
//       });

//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }

//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// });
router.post("/shop-create", async (req, res, next) => {
  try {
    const { email, name, password, phoneNumber, address, zipCode, avatar } = req.body;

    if (!email || !name || !password) {
      return next(new ErrorHandler("Please fill all required fields", 400));
    }

    const sellerEmail = await ShopModel.findOne({ email });
    if (sellerEmail) {
      return res.status(400).json({ success: false, message: "Seller already exists" });
    }

    // ✅ Only put small data in JWT — NO avatar
    const sellerData = { name, email, password, phoneNumber, address, zipCode };

    // ✅ Store avatar separately in DB or temp storage
    // For now, store everything in DB as inactive
    const activationToken = createActivationToken(sellerData);

    // ✅ Save avatar + token to DB temporarily
    await ShopModel.create({
      name,
      email,
      password,
      avatar,
      address,
      phoneNumber,
      zipCode,
      activationToken,  // add this field to your schema
      isActive: false,  // add this field to your schema
    });

    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email,
        subject: "Activate Your Shop Account",
        message: `Hello ${name}, please click the link to activate your shop account: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${email} to activate your account`
      });

    } catch (error) {
      await ShopModel.deleteOne({ email }); // cleanup if email fails
      return next(new ErrorHandler(error.message, 500));
    }

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "24h",
  });
};

// activation
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    if (!activation_token) {
      return next(new ErrorHandler("Token is required", 400));
    }

    // ✅ Verify token is valid
    let decoded;
    try {
      decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    } catch (jwtError) {
      return next(new ErrorHandler("Invalid or expired token", 400));
    }

    // ✅ Find seller by token in DB instead of JWT payload
    const seller = await ShopModel.findOne({ activationToken: activation_token });

    if (!seller) {
      return next(new ErrorHandler("Invalid token or already activated", 400));
    }

    // ✅ Activate the seller
    seller.isActive = true;
    seller.activationToken = undefined;
    await seller.save();

    sendShopToken(seller, 201, res);

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// login shop
router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const seller = await ShopModel.findOne({ email }).select("+password");

    if (!seller) {
      return next(new ErrorHandler("Seller doesn't exist!", 400));
    }

    const isPasswordValid = await seller.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct information", 400));
    }

    sendShopToken(seller, 201, res);

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// load shop
router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await ShopModel.findById(req.seller._id);

    if (!seller) {
      return next(new ErrorHandler("Seller doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      seller,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// logout from shop
router.get("/logout", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

//get shop info

router.get("/get-shop-info/:id", catchAsyncErrors(async (req, res, next) => {
  try {

    const shop = await ShopModel.findById(req.params.id)
    res.status(201).json({
      success: true,
      message: "Log Out Successful"
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

//update shop avatar
router.put("/update-shop-avatar", isSeller, upload.single("image"), catchAsyncErrors(async (req, res, next) => {
  try {

    const existsUser = await Shop.findById(req.seller._id);

    const existAvatarPath = `uploads/${existsUser.avatar}`;

    fs.unlinkSync(existAvatarPath)
    const user = await Shop.findByIdAndUpdate(req.seller._id, {
      avatar: fileUrl
    })
    res.status(200).json({
      success: true,
      user
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;