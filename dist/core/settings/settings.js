"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
exports.SETTINGS = {
    PORT: process.env.PORT || 5001,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/",
    DB_NAME: process.env.DB_NAME || "ed-back-lessons-platform",
};
