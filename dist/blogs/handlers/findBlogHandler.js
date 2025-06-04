"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlogHandler = findBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
const types_1 = require("../../core/types");
function findBlogHandler(req, res) {
    const findBlog = blogs_repository_1.blogsRepository.findById(req.params.id);
    res.status(types_1.HttpStatus.Ok).send(findBlog);
}
