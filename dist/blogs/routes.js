"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const input_validation_result_middleware_1 = require("./validation/input-validation-result.middleware");
const params_id_validation_middleware_1 = require("./validation/params-id.validation-middleware");
const getAllBlogsHandler_1 = require("./handlers/getAllBlogsHandler");
const createBlogHandler_1 = require("./handlers/createBlogHandler");
const findBlogHandler_1 = require("./handlers/findBlogHandler");
const updateBlogsHandler_1 = require("./handlers/updateBlogsHandler");
const deleteBlogHandler_1 = require("./handlers/deleteBlogHandler");
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter
  .get("/", getAllBlogsHandler_1.getAllBlogsHandler)
  .post("/", createBlogHandler_1.createBlogHandler)
  .get(
    "/:id",
    params_id_validation_middleware_1.idValidation,
    input_validation_result_middleware_1.inputValidationResultMiddleware,
    findBlogHandler_1.findBlogHandler,
  )
  .put(
    "/:id",
    params_id_validation_middleware_1.idValidation,
    updateBlogsHandler_1.updateBlogHandler,
  ) //подключить валдиацию dto
  .delete(
    "/:id",
    params_id_validation_middleware_1.idValidation,
    input_validation_result_middleware_1.inputValidationResultMiddleware,
    deleteBlogHandler_1.deleteBlogHandler,
  )
  .delete("/testing/all-data");
