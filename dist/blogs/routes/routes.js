"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const input_validation_result_middleware_1 = require("../../core/middlewares/validation/input-validation-result.middleware");
const params_id_validation_middleware_1 = require("../../core/middlewares/validation/params-id.validation-middleware");
const getAllBlogsHandler_1 = require("../handlers/getAllBlogsHandler");
const createBlogHandler_1 = require("../handlers/createBlogHandler");
const findBlogHandler_1 = require("../handlers/findBlogHandler");
const updateBlogsHandler_1 = require("../handlers/updateBlogsHandler");
const deleteBlogHandler_1 = require("../handlers/deleteBlogHandler");
const deleteAllBlogsHandler_1 = require("../handlers/deleteAllBlogsHandler");
const blog_input_dto_validation_1 = require("../../core/middlewares/blogValidation/blog-input-dto.validation");
const super_admin_guard_middleware_1 = require("../../core/middlewares/validation/super-admin.guard-middleware");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter
  .get("/", getAllBlogsHandler_1.getAllBlogsHandler)
  .post(
    "/",
    super_admin_guard_middleware_1.superAdminGuardMiddleware,
    blog_input_dto_validation_1.blogValidators,
    input_validation_result_middleware_1.inputValidationResultMiddleware,
    createBlogHandler_1.createBlogHandler,
  )
  .get(
    "/:id",
    params_id_validation_middleware_1.idValidation,
    input_validation_result_middleware_1.inputValidationResultMiddleware,
    findBlogHandler_1.findBlogHandler,
  )
  .put(
    "/:id",
    super_admin_guard_middleware_1.superAdminGuardMiddleware,
    params_id_validation_middleware_1.idValidation,
    blog_input_dto_validation_1.blogValidators,
    input_validation_result_middleware_1.inputValidationResultMiddleware,
    updateBlogsHandler_1.updateBlogHandler,
  )
  .delete(
    "/:id",
    super_admin_guard_middleware_1.superAdminGuardMiddleware,
    params_id_validation_middleware_1.idValidation,
    input_validation_result_middleware_1.inputValidationResultMiddleware,
    deleteBlogHandler_1.deleteBlogHandler,
  )
  .delete("/testing/all-data", deleteAllBlogsHandler_1.deleteAllBlogs);
