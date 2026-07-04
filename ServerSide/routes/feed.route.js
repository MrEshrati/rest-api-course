const express = require("express");
const feedController = require("../controllers/feed.controller");
const isAuth = require("../middlewares/verifyJWS.middleware");
const { body } = require("express-validator");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost,
);

router.put("/post/:postId", isAuth, feedController.updatePost);

router.delete("/post/:postId", isAuth, feedController.deletePost);

router.get("/post/:postId", isAuth, feedController.getPost);

module.exports = router;
