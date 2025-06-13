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
  .bail()
  .isString()
  .withMessage("name must be a string")
  .bail()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("more than 15 or 0")
  .bail();
exports.descriptionValidator = (0, express_validator_1.body)("description")
  .exists()
  .withMessage("description is required")
  .bail()
  .isString()
  .withMessage("description must be a string")
  .bail()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("more than 500 or 0")
  .bail();
exports.websiteUrlValidator = (0, express_validator_1.body)("websiteUrl")
  .isString()
  .withMessage("not string")
  .bail()
  .trim()
  .isURL()
  .withMessage("not url")
  .bail()
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or 0")
  .bail();
exports.blogValidators = [
  exports.websiteUrlValidator,
  exports.nameValidator,
  exports.descriptionValidator,
];
