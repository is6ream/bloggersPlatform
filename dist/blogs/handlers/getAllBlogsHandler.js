"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogsHandler = getAllBlogsHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
const types_1 = require("../../core/types");
function getAllBlogsHandler(req, res) {
  const blogs = blogs_repository_1.blogsRepository.findAll();
  res.status(types_1.HttpStatus.Ok).json(blogs);
}
