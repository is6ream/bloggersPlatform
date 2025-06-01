"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogHandler = deleteBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
const types_1 = require("../../core/types");
function deleteBlogHandler(req, res) {
  const id = req.params.id;
  blogs_repository_1.blogsRepository.delete(id);
  res.status(types_1.HttpStatus.NoContent).send();
}
