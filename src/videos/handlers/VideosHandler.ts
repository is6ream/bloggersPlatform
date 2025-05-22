import { error } from 'console';
import { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { VideoType } from "../../core/video-types";
import { body, check, validationResult } from "express-validator"
import { RESOLUTIONS, typeRESOLUTIONS } from "../../core/resolutions";





export const VideosHandlers = {
    deleteAllData: ((req: Request, res: Response) => {
        db.videos = []
        res.status(204).send()

    }),

    getAllVideos: ((req: Request, res: Response) => {
        const videos = db.videos;
        res
            .status(200)
            .json(videos)
    }),

    createVideo: (
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req) //собираем ошибки

            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array })
            }

            const newVideo: VideoType = {
                id: Math.floor(Date.now() + Math.random()),
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: true,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: new Date().toISOString(),
                availableResolutions: [
                    RESOLUTIONS.P144
                ]
            }

            db.videos.push(newVideo);
            res.status(201).send(newVideo)
        }),

    findVideo: ((req: Request, res: Response) => {
        const video: VideoType | undefined = db.videos.find(v => v.id === +req.params.id);
        if (!video) {
            res.status(404).send({ message: "Video not found" })
            return
        }
        res.status(200).send(video)
    }),

    updateVideo: ((req: Request, res: Response) => {
        const findVideo: VideoType | undefined = db.videos.find(v => v.id === +req.params.id);
        if (findVideo === undefined) {
            res.status(404).send({ message: "Video not  found" })
            return;
        }

        findVideo.title = req.body.title || findVideo.title;
        findVideo.author = req.body.author || findVideo.author;
        findVideo.canBeDownloaded = req.body.canBeDownloaded || findVideo.canBeDownloaded;
        findVideo.minAgeRestriction = req.body.minAgeRestriction || findVideo.minAgeRestriction;
        findVideo.publicationDate = req.body.publicationDate || findVideo.publicationDate;
        findVideo.availableResolutions = req.body.availableResolutions || findVideo.availableResolutions;

        res.status(204).send();
    }),

    deleteVideo: ((req: Request, res: Response) => {
        const findVideo = db.videos.find(v => v.id === +req.params.id);
        const id = +req.params.id
        if (findVideo === undefined) {
            res.status(404).send({ message: "Video not  found" })
            return;
        }

        db.videos = db.videos.filter(v => v.id !== id)
        res.status(204).send();
    })



}