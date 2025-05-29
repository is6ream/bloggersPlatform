"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const resolutions_1 = require("./core/resolutions");
exports.db = {
    videos: [],
};
const dbEntity = {
    id: 0,
    title: "t1",
    author: "a1",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [resolutions_1.RESOLUTIONS.P1440],
};
