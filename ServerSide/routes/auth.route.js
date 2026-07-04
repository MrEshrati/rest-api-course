const express = require("express");
const User = require("../models/user.model");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .custom(async (value, { req }) => {
        const userDocument = await User.findOne({ email: value });

        if (userDocument) {
          return Promise.reject("Email already exist");
        }
      }),
    body("password").trim().isLength({ min: 4 }),
    body("name").trim().isLength({ min: 5 }).notEmpty(),
  ],
  authController.signup
);

router.post("/login",authController.login)

module.exports = router;