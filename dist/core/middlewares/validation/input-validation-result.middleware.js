"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationResultMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../../http-statuses");
const formatErrors = (error) => ({
  message: error.msg,
  field: "path" in error ? error.path : "unknown",
});
const inputValidationResultMiddleware = (req, res, next) => {
  const errors = (0, express_validator_1.validationResult)(req)
    .formatWith(formatErrors)
    .array();
  if (errors.length) {
    res
      .status(http_statuses_1.HttpStatus.BadRequest)
      .send({ errorsMessages: errors });
  }
  next();
};
exports.inputValidationResultMiddleware = inputValidationResultMiddleware;
