const { validationResult } = require("express-validator");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

exports.getPosts = async (req, res, next) => {
  try {
    const postList = await Post.find();

    if (postList) {
      res
        .status(200)
        .json({ message: "Fetched Posts Successfuly", posts: postList });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(
        "Validatoin Failed, the data you entered is invalid!",
      );
      error.statusCode = 422;

      throw error;
    }

    if (!req.file) {
      const error = new Error("Please upload a file");
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
      title: title,
      content: content,
      imageUrl: req.file.path,
      creator: req.userId,
    });

    const postResult = await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(postResult);
    const creator = await user.save();

    res.status(201).json({
      message: "Post Created!!",
      post: postResult,
      creator: creator,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Post Fetched", post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(
        "Validatoin Failed, the data you entered is invalid!",
      );
      error.statusCode = 422;

      throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    // if (!imageUrl || imageUrl == 'undefined') {
    //   const error = new Error("Please upload a imageFile");
    //   error.statusCode = 422;
    //   throw error;
    // }

    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.stoString() != req.userId) {
      const error = new Error("not authorized");
      error.statusCode = 403;
      throw error;
    }

    if (imageUrl != post.imageUrl && imageUrl != "undefined") {
      await clearImage(post.imageUrl);
      post.imageUrl = imageUrl;
    }

    post.title = title;
    post.content = content;

    await post.save();
    res.status(200).json({
      message: "Post Updated Successfully",
      post: post,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.stoString() != req.userId) {
      const error = new Error("not authorized");
      error.statusCode = 403;
      throw error;
    }

    clearImage(post.imageUrl);
    const deletedPost = await Post.findByIdAndDelete(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(mongoose.Types.ObjectId(postId));
    await user.save();

    res.status(200).json({
      post: post,
      message: "Post deleted successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const clearImage = async (filePath) => {
  file = path.join(__dirname, "../", filePath);

  if (fs.existsSync(file)) {
    await fs.unlinkSync(file, (err) => {
      throw err;
    });

    console.log("Image deleted!");
  } else {
    console.log("Image not found!");
  }
};
