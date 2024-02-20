const Blog = require("../models/Blog.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

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

// Get all blogs with caching implemented for the faster response time
exports.getAllBlogs = async (req, res) => {
  let blogs;
  if (myCache.has("blogs")) {
    blogs = JSON.parse(myCache.get("blogs"));
  } else {
    blogs = await Blog.find();
    myCache.set("blogs", JSON.stringify(blogs), 5 * 60); // expires in 5 minutes
  }

  res.json(blogs);
};

// Delete Blog by ID
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

// Update a blog by ID
exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true } // Return the updated document
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get paginated blogs
exports.getPaginatedBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await Blog.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = await Blog.find().limit(limit).skip(startIndex).exec();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
