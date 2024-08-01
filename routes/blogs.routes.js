const express = require("express");
const router = express.Router();
const blogController = require("../controllers/BlogController"); // Adjust the path according to your file structure

router.post("/create", blogController.createBlog);
router.get("/all", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);
router.patch("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
