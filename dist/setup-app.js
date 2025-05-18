"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const setupApp = (app) => {
    app.use(express_1.default.json());
    app.get('/', (req, res) => {
        res.status(200).send("Hello world");
    });
    app.get('/video', (req, res) => {
        res.send(db_1.newVideo).status(200);
    });
    return app;
};
exports.setupApp = setupApp;
