"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogHandler = deleteBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
function deleteBlogHandler(req, res) {
  const id = req.params.id;
  blogs_repository_1.blogsRepository.delete(id);
  res.status(204).send();
}
