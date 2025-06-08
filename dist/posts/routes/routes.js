"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const post_input_dto_validation_1 = require("./../../core/middlewares/postValidation/post-input-dto.validation");
const express_1 = require("express");
const getAllpostsHandler_1 = require("../handlers/getAllpostsHandler");
const createPostHandler_1 = require("../handlers/createPostHandler");
const findPostHandler_1 = require("../handlers/findPostHandler");
const updatePostHandler_1 = require("../handlers/updatePostHandler");
const deletePostHandler_1 = require("../handlers/deletePostHandler");
const super_admin_guard_middleware_1 = require("../../core/middlewares/validation/super-admin.guard-middleware");
const input_validation_result_middleware_1 = require("../../core/middlewares/validation/input-validation-result.middleware");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const deleteAllPostsHandler_1 = require("../handlers/deleteAllPostsHandler");
exports.postRouter = (0, express_1.Router)();
exports.postRouter
    .delete("/all-data", deleteAllPostsHandler_1.deleteAllPosts)
    .get("/", getAllpostsHandler_1.getAllPostsHandler)
    .post("/", super_admin_guard_middleware_1.superAdminGuardMiddleware, post_input_dto_validation_1.postValidators, input_validation_result_middleware_1.inputValidationResultMiddleware, createPostHandler_1.createPostHandler)
    .get("/:id", params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, findPostHandler_1.findPostHandler)
    .put("/:id", super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, post_input_dto_validation_1.postValidators, input_validation_result_middleware_1.inputValidationResultMiddleware, updatePostHandler_1.updatePostHandler)
    .delete("/:id", super_admin_guard_middleware_1.superAdminGuardMiddleware, params_id_validation_middleware_1.idValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, deletePostHandler_1.deletePostHandler);
