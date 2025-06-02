"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPostHandler = findPostHandler;
const postRepository_1 = require("../repositories/postRepository");
const types_1 = require("../../core/types");
function findPostHandler(req, res) {
  const post = postRepository_1.postRepository.findById(req.params.id);
  if (!post) {
    res.status(types_1.HttpStatus.NotFound).send("Post not found!");
  }
  res.status(types_1.HttpStatus.Ok).send(post);
}
