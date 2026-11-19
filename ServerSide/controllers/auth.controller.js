const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(
        "Validatoin Failed, the data you entered is invalid!",
      );
      error.statusCode = 422;

      throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });

    const result = user.save();

    res.status(201).json({
      message: "User created!",
      userId: result._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    const passAuth = await bcrypt.compare(password, user.password);
    if (!passAuth) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({token: token,userId: user._id.toString()})
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
