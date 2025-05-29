"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosHandlers = void 0;
const db_1 = require("../../db");
const create_update_validation_1 = require("../validation/create-update.validation");
exports.VideosHandlers = {
    deleteAllData: (req, res) => {
        db_1.db.videos = [];
        res.status(204).send();
    },
    getAllVideos: (req, res) => {
        const videos = db_1.db.videos;
        res.status(200).json(videos);
    },
    createVideo: (req, res) => {
        const errors = (0, create_update_validation_1.createInputValidation)(req.body);
        if (errors.errorsMessages.length) {
            res.status(400).json(errors);
            return;
        }
        const newVideo = {
            id: Math.floor(Date.now() + Math.random()),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: req.body.availableResolutions,
        };
        db_1.db.videos.push(newVideo);
        res.status(201).send(newVideo);
    },
    findVideo: (req, res) => {
        const video = db_1.db.videos.find((v) => v.id === +req.params.id);
        if (!video) {
            res.status(404).send({ message: "Video not found" });
            return;
        }
        res.status(200).send(video);
    },
    updateVideo: (req, res) => {
        const errors = (0, create_update_validation_1.updateInputValidation)(req.body);
        if (errors.errorsMessages.length) {
            res.status(400).json(errors);
            return;
        }
        const findVideo = db_1.db.videos.find((v) => v.id === +req.params.id);
        if (findVideo === undefined) {
            res.status(404).send({ message: "Video not  found" });
            return;
        }
        findVideo.title = req.body.title || findVideo.title;
        findVideo.author = req.body.author || findVideo.author;
        findVideo.canBeDownloaded =
            req.body.canBeDownloaded || findVideo.canBeDownloaded;
        findVideo.minAgeRestriction =
            req.body.minAgeRestriction || findVideo.minAgeRestriction;
        findVideo.publicationDate =
            req.body.publicationDate || findVideo.publicationDate;
        findVideo.availableResolutions =
            req.body.availableResolutions || findVideo.availableResolutions;
        res.status(204).send();
    },
    deleteVideo: (req, res) => {
        const findVideo = db_1.db.videos.find((v) => v.id === +req.params.id);
        const id = +req.params.id;
        if (findVideo === undefined) {
            res.status(404).send({ message: "Video not  found" });
            return;
        }
        db_1.db.videos = db_1.db.videos.filter((v) => v.id !== id);
        res.status(204).send();
    },
};
