"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const deleteAllPostsHandler_1 = require("../posts/handlers/deleteAllPostsHandler");
const deleteAllBlogsHandler_1 = require("../blogs/handlers/deleteAllBlogsHandler");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete("/all-data", deleteAllBlogsHandler_1.deleteAllBlogs, deleteAllPostsHandler_1.deleteAllPosts);
