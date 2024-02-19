const Blog = require("../models/Blog.js");

exports.createBlog = async (req, res) => {
  const { title, content, imgSrc } = req.body;

  const newBlog = new Blog({
    title,
    content,
    author: req.user.username,
    imgSrc,
  });
  await newBlog.save();
  res.status(201).json(newBlog);
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
};

// Implement other CRUD operations similarly
