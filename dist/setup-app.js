"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const setupApp = (app) => {
    app.use(express_1.default.json());
    app.get('/', (req, res) => {
        res.status(200).send("Hello world");
    });
    app.get('/', (req, res) => {
    });
    return app;
};
exports.setupApp = setupApp;
