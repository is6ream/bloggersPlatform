"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const mongo_db_1 = require("../../db/mongo.db");
const types_1 = require("../../core/types");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete("/all-data", (req, res) => {
    mongo_db_1.db.posts = [];
    mongo_db_1.db.blogs = [];
    res.sendStatus(types_1.HttpStatus.NoContent);
});
