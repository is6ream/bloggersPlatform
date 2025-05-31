"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogHandler = createBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
function createBlogHandler(req, res) {
    // const errors = createInputValidation(req.body);
    // if (errors.errorsMessages.length) {
    //   res.status(400).json(errors);
    //   return;
    // }
    const newBlog = {
        id: new Date().toISOString(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    };
    blogs_repository_1.blogsRepository.create(newBlog);
    res.status(201).send(newBlog);
}
