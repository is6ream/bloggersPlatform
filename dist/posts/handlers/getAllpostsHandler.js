"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPostsHandler = getAllPostsHandler;
const types_1 = require("../../core/types");
const postRepository_1 = require("../repositories/postRepository");
function getAllPostsHandler(req, res) {
    const posts = postRepository_1.postRepository.findAll();
    res.status(types_1.HttpStatus.Ok).json(posts);
}
