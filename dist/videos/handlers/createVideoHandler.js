"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoHandler = createVideoHandler;
const db_1 = require("../../db");
const create_update_validation_1 = require("../validation/create-update.validation");
function createVideoHandler(req, res) {
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
}
