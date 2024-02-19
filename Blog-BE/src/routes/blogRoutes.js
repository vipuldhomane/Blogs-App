const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create", authenticateToken, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.delete("/delete/:id", authenticateToken, blogController.deleteBlog);
router.put("/update/:id", authenticateToken, blogController.updateBlog);
module.exports = router;
