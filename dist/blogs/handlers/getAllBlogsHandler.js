"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogsHandler = getAllBlogsHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
function getAllBlogsHandler(req, res) {
  const blogs = blogs_repository_1.blogsRepository.findAll;
  res.status(200).json(blogs);
}
