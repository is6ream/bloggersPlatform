"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostHandler = deletePostHandler;
const types_1 = require("../../core/types");
const postRepository_1 = require("../repositories/postRepository");
function deletePostHandler(req, res) {
  const id = req.params.id;
  postRepository_1.postRepository.delete(id);
  res.status(types_1.HttpStatus.NoContent).send();
}
