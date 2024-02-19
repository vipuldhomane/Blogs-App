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

exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully", deletedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Implement other CRUD operations similarly
