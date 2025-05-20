"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("./setup-app");
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./videos/routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, setup_app_1.setupApp)(app);
const PORT = process.env.PORT || 5001;
app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
});
app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
});
app.use('/hometask_01/api/videos', routes_1.videosRouter);
