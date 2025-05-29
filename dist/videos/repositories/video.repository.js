"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRepository = void 0;
const db_1 = require("../../db");
exports.videoRepository = {
    findAll() {
        return db_1.db.videos;
    },
    findById(id) {
        var _a;
        return (_a = db_1.db.videos.find((v) => v.id === id)) !== null && _a !== void 0 ? _a : null;
    },
    create(newVideo) {
        db_1.db.videos.push(newVideo);
        return newVideo;
    },
    update(id, dto) {
        const video = db_1.db.videos.find((v) => v.id === id);
        if (!video) {
            throw new Error("Video not exist");
        }
        video.title = dto.title;
        video.author = dto.author;
        video.availableResolutions = dto.availableResolutions;
        video.canBeDownloaded = dto.canBeDownloaded;
        video.minAgeRestriction = dto.minAgeRescriction;
        video.publicationDate = dto.publicationDate;
        return;
    },
    delete(id) {
        const index = db_1.db.videos.findIndex((v) => v.id === id);
        if (index === -1) {
            throw new Error("Video not exist");
        }
        db_1.db.videos.splice(index, 1);
        return;
    },
};
