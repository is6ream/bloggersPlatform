"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = createPostHandler;
const postRepository_1 = require("../repositories/postRepository");
const types_1 = require("../../core/types");
const mongo_db_1 = require("../../db/mongo.db");
function generateNumericId(length = 10) {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
    return randomNumber.toString().padStart(length, "0");
}
function createPostHandler(req, res) {
    const foundBlog = mongo_db_1.blogCollection.findOne({ _id: req.body.id });
    if (!foundBlog) {
        res.status(types_1.HttpStatus.NotFound).send("Blog not found");
        return;
    }
    const newPost = {
        id: generateNumericId(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: foundBlog.id,
        blogName: foundBlog.name,
        createdAt: req.body.createdAt,
    };
    postRepository_1.postRepository.create(newPost);
    res.status(types_1.HttpStatus.Created).send(newPost);
}
