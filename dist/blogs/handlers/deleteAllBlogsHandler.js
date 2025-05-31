"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllBlogs = deleteAllBlogs;
const types_1 = require("../../core/types");
const blogs_repository_1 = require("../repositories/blogs.repository");
function deleteAllBlogs(req, res) {
    blogs_repository_1.blogsRepository.deleteAll();
    res.status(types_1.HttpStatus.NoContent).send();
}
