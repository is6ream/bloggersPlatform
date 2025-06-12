"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const blogs_routes_1 = require("./blogs/blogs.routes");
const paths_1 = require("./core/paths");
const routes_1 = require("./posts/routes/routes");
const testing_router_1 = require("./testing/testing-router");
// import { testingRouter } from "./testing/routers/testing.router";
exports.app = (0, express_1.default)();
const setupApp = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.get("/", (req, res) => {
        res.status(200).send("Hello world!");
    });
    app.use(paths_1.BLOGS_PATH, blogs_routes_1.blogsRouter);
    app.use(paths_1.POSTS_PATH, routes_1.postRouter);
    app.use(paths_1.TESTING_PATH, testing_router_1.testingRouter);
    return app;
};
exports.setupApp = setupApp;
(0, exports.setupApp)(exports.app);
