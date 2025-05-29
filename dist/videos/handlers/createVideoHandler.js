"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoHandler = createVideoHandler;
const create_update_validation_1 = require("../validation/create-update.validation");
const video_repository_1 = require("../repositories/video.repository");
function createVideoHandler(req, res) {
    const errors = (0, create_update_validation_1.createInputValidation)(req.body);
    if (errors.errorsMessages.length) {
        res.status(400).json(errors);
        return;
    }
    let newVideo = req.body;
    video_repository_1.videoRepository.create(newVideo);
    res.status(201).send(newVideo);
}
