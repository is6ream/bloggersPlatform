"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationResultMiddleware = void 0;
const express_validator_1 = require("express-validator");
const formatErrors = (error) => ({
    field: error.type,
    message: error.msg,
});
const inputValidationResultMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(formatErrors).array();
    if (errors.length) {
        res.status(400).json({ errorsMessages: errors });
    }
    next();
};
exports.inputValidationResultMiddleware = inputValidationResultMiddleware;
