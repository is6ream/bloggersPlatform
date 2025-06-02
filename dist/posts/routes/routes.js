"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const getAllpostsHandler_1 = require("../handlers/getAllpostsHandler");
const createPostHandler_1 = require("../handlers/createPostHandler");
const findPostHandler_1 = require("../handlers/findPostHandler");
const updatePostHandler_1 = require("../handlers/updatePostHandler");
const deletePostHandler_1 = require("../handlers/deletePostHandler");
const super_admin_guard_middleware_1 = require("../../core/middlewares/validation/super-admin.guard-middleware");
exports.postRouter = (0, express_1.Router)();
exports.postRouter
  .get("/", getAllpostsHandler_1.getAllPostsHandler)
  .post(
    "/",
    super_admin_guard_middleware_1.superAdminGuardMiddleware,
    createPostHandler_1.createPostHandler,
  )
  .get("/:id", findPostHandler_1.findPostHandler)
  .put("/:id", updatePostHandler_1.updatePostHandler)
  .delete("/:id", deletePostHandler_1.deletePostHandler);
