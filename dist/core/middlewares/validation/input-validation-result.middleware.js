"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationResultMiddleware = void 0;
const express_validator_1 = require("express-validator");
const types_1 = require("../../types");
const formatErrors = (error) => ({
  field: error.param,
  message: error.msg,
});
const inputValidationResultMiddleware = (req, res, next) => {
  const errors = (0, express_validator_1.validationResult)(req)
    .formatWith(formatErrors)
    .array();
  if (errors.length) {
    return res
      .status(types_1.HttpStatus.BadRequest)
      .json({ errorMessages: errors });
  }
  next;
};
exports.inputValidationResultMiddleware = inputValidationResultMiddleware;
