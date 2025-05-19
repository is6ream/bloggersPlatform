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
    app.get('/videos', (req, res) => {
        res.status(200).send(db_1.db.videos);
    });
    app.get('/videos/:id', (req, res) => {
        const video = db_1.db.videos.find(v => v.id === +req.params.id);
        if (video === undefined) {
            res.status(404).send({ message: "Video not found" });
        }
        ;
        res.status(200).send(video);
    }),
        app.post('/videos', (req, res) => {
            const newVideo = {
                id: Number(new Date().toISOString()),
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: true,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: new Date().toISOString(),
                availableResolutions: [
                    "P144" /* availableResolutions.P144 */
                ]
            };
            res.status(201).send(newVideo);
        });
    app.put('/videos/:id', (req, res) => {
        const findVideo = db_1.db.videos.find(v => v.id === +req.params.id);
        if (!findVideo) {
            res.status(404).send({ message: "Video not  found" });
        }
        findVideo.title = req.body.title || (findVideo === null || findVideo === void 0 ? void 0 : findVideo.title);
    });
    return app;
};
exports.setupApp = setupApp;
