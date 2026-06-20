const { validationResult } = require("express-validator");
const Post = require("../models/post.model");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is First Content",
        imageUrl: "/public/images/sample.png",
        createdAt: new Date(),
        creator: {
          name: "Arshia",
        },
      },
    ],
  });
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
      return res.status(422).json({
        message: "Validatoin Failed, the data you entered is invalid!",
        errors: errors.array(),
      });
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
      title: title,
      content: content,
      imageUrl: "/public/images/sample.png",
      creator: {
        name: "Arshia",
      },
    });

    const postResult = await post.save();

    res.status(201).json({
      message: "Post Created!!",
      post: postResult,
    });
  } catch(err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }

    next(err);
  }
};
