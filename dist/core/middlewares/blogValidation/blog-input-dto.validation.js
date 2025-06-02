"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidators =
  exports.websiteUrlValidator =
  exports.descriptionValidator =
  exports.nameValidator =
    void 0;
const express_validator_1 = require("express-validator");
exports.nameValidator = (0, express_validator_1.body)("name")
  .exists()
  .withMessage("name is required")
  .isString()
  .withMessage("name must be a string")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("more than 15 or 0");
exports.descriptionValidator = (0, express_validator_1.body)("description")
  .exists()
  .withMessage("description is required")
  .isString()
  .withMessage("description must be a string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("more than 500 or 0");
exports.websiteUrlValidator = (0, express_validator_1.body)("websiteUrl")
  .isString()
  .withMessage("not string")
  .trim()
  .isURL()
  .withMessage("not url")
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or 0");
exports.blogValidators = [
  exports.nameValidator,
  exports.descriptionValidator,
  exports.websiteUrlValidator,
];
