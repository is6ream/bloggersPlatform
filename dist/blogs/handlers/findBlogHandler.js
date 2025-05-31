"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlogHandler = findBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
function findBlogHandler(req, res) {
  const findBlog = blogs_repository_1.blogsRepository.findById(req.params.id);
  res.status(200).send(findBlog);
}
