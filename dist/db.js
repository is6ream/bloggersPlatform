"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newVideo = void 0;
exports.newVideo = {
    id: new Date().toISOString() + Math.random(),
    title: 'new title',
    author: 'new author',
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString() + Math.random(),
    availableResolutions: [
        "P144"
    ]
};
