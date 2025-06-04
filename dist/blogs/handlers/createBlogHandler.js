"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogHandler = createBlogHandler;
const blogs_repository_1 = require("../repositories/blogs.repository");
function generateNumericId(length = 10) {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
    return randomNumber.toString().padStart(length, "0");
}
function createBlogHandler(req, res) {
    const newBlog = {
        id: generateNumericId(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        createdAt: req.body.createdAt,
        isMembership: req.body.isMembership,
    };
    blogs_repository_1.blogsRepository.create(newBlog);
    res.status(201).send(newBlog);
}
