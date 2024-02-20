const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create", authenticateToken, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.delete("/delete/:id", authenticateToken, blogController.deleteBlog);
router.put("/update/:id", authenticateToken, blogController.updateBlog);
// Pagination  for Blogs
// /getBlogsPaginated?page=1&limit=10
router.get("/getBlogPeginated", blogController.getPaginatedBlogs);

module.exports = router;
