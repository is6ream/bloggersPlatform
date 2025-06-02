"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostHandler = updatePostHandler;
const postRepository_1 = require("../repositories/postRepository");
const types_1 = require("../../core/types");
function updatePostHandler(req, res) {
    postRepository_1.postRepository.update(req.params.id, req.body);
    res.status(types_1.HttpStatus.NoContent).send();
}
