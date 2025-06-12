"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidation = void 0;
const express_validator_1 = require("express-validator");
const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;
//для route параметров
exports.idValidation = (0, express_validator_1.param)("id")
    .exists()
    .withMessage("Id is required")
    .trim()
    .notEmpty()
    .matches(ObjectIdRegex)
    .withMessage("Invalid ObjectId format");
