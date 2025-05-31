"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogHandler = updateBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
function updateBlogHandler(req, res) {
  blogs_repository_1.blogsRepository.update(req.params.id, req.body);
  res.status(204).send();
}
