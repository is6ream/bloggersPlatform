"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidators = exports.blogIdValidator = exports.contentValidator = exports.shortDescriptionValidator = exports.titleValidator = void 0;
const express_validator_1 = require("express-validator");
exports.titleValidator = (0, express_validator_1.body)("title")
    .exists()
    .withMessage("title is required")
    .bail()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("More than 30 or 0")
    .bail();
exports.shortDescriptionValidator = (0, express_validator_1.body)("shortDescription")
    .exists()
    .withMessage("shortDescription is required")
    .bail()
    .isString()
    .withMessage("shortDescription must be a string")
    .bail()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("More than 100 or 0")
    .bail();
exports.contentValidator = (0, express_validator_1.body)("content")
    .exists()
    .withMessage("content is required")
    .bail()
    .isString()
    .withMessage("content must be a string")
    .bail()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("More than 1000 or 0")
    .bail();
exports.blogIdValidator = (0, express_validator_1.body)("blogId")
    .exists()
    .withMessage("blogId is required")
    .bail()
    .isString()
    .withMessage("blogId must be a string")
    .bail();
exports.postValidators = [
    exports.titleValidator,
    exports.shortDescriptionValidator,
    exports.contentValidator,
    exports.blogIdValidator,
];
