const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
// Implement other CRUD routes similarly

module.exports = router;
