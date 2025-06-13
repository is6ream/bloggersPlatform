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
exports.postsService = void 0;
const postRepository_1 = require("../repositories/postRepository");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
exports.postsService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return postRepository_1.postRepository.findAll(queryDto);
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return postRepository_1.postRepository.findById(id);
        });
    },
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogs_repository_1.blogsRepository.findById(dto.blogId);
            if (!foundBlog) {
                throw new Error("blog not found");
            }
            const newPost = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId,
                blogName: foundBlog.name,
                createdAt: new Date().toISOString(),
            };
            return postRepository_1.postRepository.create(newPost);
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            postRepository_1.postRepository.update(id, dto);
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            postRepository_1.postRepository.delete(id);
            return;
        });
    },
};
