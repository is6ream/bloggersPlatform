"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = createPostHandler;
const postRepository_1 = require("../repositories/postRepository");
const types_1 = require("../../core/types");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundBlog = yield blogs_repository_1.blogsRepository.findById(req.body.blogId);
        if (!foundBlog) {
            res.status(types_1.HttpStatus.NotFound).send("Blog not found");
            return;
        }
        const newPost = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: foundBlog.id,
            blogName: foundBlog.name,
            createdAt: new Date().toISOString(),
        };
        const dataForResponse = yield postRepository_1.postRepository.create(newPost);
        res.status(types_1.HttpStatus.Created).send(dataForResponse);
    });
}
