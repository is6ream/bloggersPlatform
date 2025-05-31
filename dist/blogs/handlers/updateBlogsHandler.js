"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogHandler = updateBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
const types_1 = require("../../core/types");
function updateBlogHandler(req, res) {
    blogs_repository_1.blogsRepository.update(req.params.id, req.body);
    res.status(types_1.HttpStatus.NoContent).send();
}
