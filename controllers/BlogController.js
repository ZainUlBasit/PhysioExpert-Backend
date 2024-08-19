const Blog = require("../Models/Blog"); // Adjust the path according to your file structure
const { createError, successMessage } = require("../utils/ResponseMessage"); // Adjust the path according to your file structure

// Create a new blog
const createBlog = async (req, res) => {
  const { title, imageUrl, date, desc } = req.body;
  try {
    const newBlog = new Blog({
      title,
      imageUrl,
      desc,
      date: Math.floor(new Date(date) / 1000),
    });
    const savedBlog = await newBlog.save();
    return successMessage(res, savedBlog, "Blog created successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    return successMessage(res, blogs, "Blogs retrieved successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return createError(res, 404, "Blog not found");
    }
    return successMessage(res, blog, "Blog retrieved successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, date } = req.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, imageUrl, date: Math.floor(new Date(date) / 1000) },
      { new: true }
    );
    if (!updatedBlog) {
      return createError(res, 404, "Blog not found");
    }
    return successMessage(res, updatedBlog, "Blog updated successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return createError(res, 404, "Blog not found");
    }
    return successMessage(res, deletedBlog, "Blog deleted successfully");
  } catch (error) {
    return createError(res, 500, error.message);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
