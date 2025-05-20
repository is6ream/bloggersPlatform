"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const getVideosHandler_1 = require("./handlers/getVideosHandler");
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter
    .get('/videos', getVideosHandler_1.getVideosHandlers.getAllVideos);
// .get('/videos/:id', (req: Request, res: Response) => {
//     const video: VideoType | undefined = db.videos.find(v => v.id === +req.params.id)
//     if (video === undefined) {
//         res.status(404).send({ message: "Video not found" })
//     };
//     res.status(200).send(video)
// })
// .post('/videos', (req: Request, res: Response) => {
//     const newVideo: VideoType = {
//         id: Math.floor(Date.now() + Math.random()),
//         title: req.body.title,
//         author: req.body.author,
//         canBeDownloaded: true,
//         minAgeRestriction: null,
//         createdAt: new Date().toISOString(),
//         publicationDate: new Date().toISOString(),
//         availableResolutions: [
//             availableResolutions.P144
//         ]
//     }
//     db.videos.push(newVideo);
//     res.status(201).send(newVideo);
// })
// .put('/videos/:id', (req: Request, res: Response) => {
//     const findVideo: VideoType | undefined = db.videos.find(v => v.id === +req.params.id);
//     if (findVideo === undefined) {
//         res.status(404).send({ message: "Video not  found" })
//         return;
//     }
//     findVideo.title = req.body.title || findVideo.title;
//     findVideo.author = req.body.author || findVideo.author;
//     findVideo.canBeDownloaded = req.body.canBeDownloaded || findVideo.canBeDownloaded;
//     findVideo.minAgeRestriction = req.body.minAgeRestriction || findVideo.minAgeRestriction;
//     findVideo.publicationDate = req.body.publicationDate || findVideo.publicationDate;
//     findVideo.availableResolutions = req.body.availableResolutions || findVideo.availableResolutions;
//     res.status(204).send();
// })
// .delete('/videos/:id', (req: Request, res: Response) => {
//     const id = +req.params.id
//     const findVideo: VideoType | undefined = db.videos.find(v => v.id === id);
//     if (!findVideo) {
//         res.status(404).send({ message: "Video is not found!" });
//     }
//     db.videos = db.videos.filter(v => v.id !== id)
//     res.status(204).send()
// });
