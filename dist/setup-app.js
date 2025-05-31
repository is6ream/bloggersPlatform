"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./blogs/routes");
const paths_1 = require("./core/paths");
exports.app = (0, express_1.default)();
const setupApp = (app) => {
  app.use(express_1.default.json());
  app.use((0, cors_1.default)());
  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });
  app.use(paths_1.VIDEOS_PATH, routes_1.videosRouter);
  return app;
};
exports.setupApp = setupApp;
