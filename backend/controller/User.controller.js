const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const User = require("../model/user.model.js")
const { upload } = require("../multer.js")
const ErrorHandler = require("../utils/ErrorHandler")
const router = express.Router()
const fs = require("fs")
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");
const { isAuthenticated } = require("../middleware/auth.js")

// POST /api/v2/user/create-user
// router.post("/create-user", upload.single("file"), async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const userEmail = await User.findOne({ email });
//     if (userEmail) {
//       if (req.file?.filename) {
//         const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
//         await fs.promises.unlink(filePath).catch(() => { });
//       }
//       return next(new ErrorHandler("User already exists", 400));
//     }

//     // Validate file
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "File upload required" });
//     }

//     const filename = req.file.filename;
//     const fileUrl = path.join("uploads", filename);

//     const user = {
//       name,
//       email,
//       password,
//       avatar: fileUrl,
//     };

//     // create a temporary ObjectId for the token payload
//     const tempUser = { ...user, _id: new mongoose.Types.ObjectId() };

//     // sign token using the temporary id
//     const activationToken = createActivationToken(tempUser);
//     const activationUrl = `http://localhost:5173/activation/${encodeURIComponent(activationToken)}`;

//     try {
//       await sendMail({
//         email: user.email,
//         subject: "Activate Your Account",
//         message: `Hello ${user.name}, please click on the link to activate your account : ${activationUrl}`,
//       });

//       // persist user only after email successfully sent
//       const newUser = await User.create({
//         _id: tempUser._id,
//         ...user,
//         isVerified: false,
//       });

//       res.status(201).json({
//         success: true,
//         message: `please check your email:- ${newUser.email} to activate your account`
//       });

//     } catch (error) {
//       // cleanup uploaded file if email/send fails
//       if (req.file?.filename) {
//         await fs.promises.unlink(path.join(__dirname, "..", "uploads", req.file.filename)).catch(() => { });
//       }
//       return next(new ErrorHandler(error.message || "Failed to send activation email", 500));
//     }

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // create activation token
// const createActivationToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.ACTIVATION_SECRET, {
//     expiresIn: "1d"
//   })
// }

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) console.log(err);
      });
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File upload required" });
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    //  IMPORTANT: Don't save to DB yet, just create token with plain data
    const user = {
      name,           //  Must include
      email,          //  Must include
      password,       // Must include (plain text, will hash on activation)
      avatar: fileUrl //  Must include
    };

    console.log("User data for token:", user); // Debug log

    // Create activation token with user data (NOT with saved user ID)
    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate Your Account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account`
      });

    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "24h",
  });
};

// activate user
// router.post("/activation", catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { activation_token } = req.body;

//     let payload;
//     try {
//       payload = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         return next(new ErrorHandler("Activation token expired. Please sign up again.", 400));
//       }
//       return next(new ErrorHandler("Invalid token", 400));
//     }

//     const userId = payload?.id;
//     if (!userId) {
//       return next(new ErrorHandler("Invalid token", 400));
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }
//     if (user.isVerified) {
//       return next(new ErrorHandler("User already verified", 400));
//     }

//     user.isVerified = true;
//     await user.save();

//     sendToken(user, 201, res);
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// }));
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    // console.log("========== ACTIVATION DEBUG ==========");
    // console.log("1. Token received:", activation_token ? "YES" : "NO");

    if (!activation_token) {
      return next(new ErrorHandler("Token is required", 400));
    }

    let newUser;
    try {
      newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      // console.log("2. Token verified successfully");
      // console.log("3. Full decoded data:", newUser);
    } catch (jwtError) {
      console.log("2. JWT Error:", jwtError.message);
      return next(new ErrorHandler("Invalid or expired token", 400));
    }

    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar } = newUser;

    // console.log("4. Extracted fields:");
    // console.log("   - name:", name);
    // console.log("   - email:", email);
    // console.log("   - password:", password ? "EXISTS" : "MISSING");
    // console.log("   - avatar:", avatar);

    // Check if all required fields exist
    if (!name || !email || !password) {
      console.log("5. Missing required fields!");
      return next(new ErrorHandler("Invalid token data", 400));
    }

    let user = await User.findOne({ email });
    // console.log("6. Existing user check:", user ? "EXISTS" : "NOT EXISTS");

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    console.log("7. Creating user...");

    user = await User.create({
      name,
      email,
      password,  // Make sure this is being passed
      avatar,
    });

    // console.log("8. User created! ID:", user._id);
    // console.log("======================================");

    sendToken(user, 201, res);
  } catch (error) {
    console.error("ACTIVATION ERROR:", error);
    return next(new ErrorHandler(error.message, 500));
  }
})
);

// POST /api/v2/user/login-user
router.post("/login-user", catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

module.exports = router
// load user
router.get("/getuser", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

// logout user
router.get("/logout", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
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

//update user information
router.put("update-user-info", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password, phoneNumber, name } = req.body;

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return next(new ErrorHandler("User not found", 400))
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      )
    }

    user.name = name;
    user.email = email
    user.phoneNumber = phoneNumber;

    await user.save()

    res.status(201).json({
      success: true,
      user
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

//update user avatar
router.put("/update-avatar", isAuthenticated, upload.single("image"), catchAsyncErrors(async (req, res, next) => {
  try {

    const existsUser = await User.findById(req.user.id);

    const existAvatarPath = `uploads/${existsUser.avatar}`;

    fs.unlinkSync(existAvatarPath)
    const user = await User.findByIdAndUpdate(req.user._id, {
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

//update user addresses
router.put("/update-user-addresses", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {

    const user = await User.findById(req.user._id)
    const sameTypeAddress = user.addresses.find((address) => address.addressType === req.body.addressType)
    if (sameTypeAddress) {
      return next(new ErrorHandler(`${req.body.addressType} Address already exists`))
    }

    const existAddress = user.address.find(address => address._id === req.body._id)

    if (existAddress) {
      Object.assign(existAddress, req.body)
    } else {
      //add new address to the array
      user.addresses.push(req.body)
    }

    await user.save()

    res.status(200).json({
      success: true,
      user
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

//delete user address
router.delete("delete-user-address/:id", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user_id
    const addressId = req.params.id

    await User.updateOne({
      _id: userId
    }, { $pull: { addresses: { _id: addressId } } }
    );

    const user = await User.findById(userId)
    res.status(200).json({ success: true, user })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

//update user password
router.put('/update-user-password', isAuthenticated, catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await user.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePasssword(req.body.oldPassword)

    if (!isPasswordMatched) {
      return next(next(new ErrorHandler("Old password is incorrect!", 400)))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(next(new ErrorHandler("Passsword does not matched with each other!", 400)))
    }
    user.password = req.body.newPassword;

    await user.save()
    res.status(200).json({ success: true, message: "Paasword updated successfully" })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

}))

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
)


module.exports = router