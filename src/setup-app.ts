import express, { Express } from "express"
import { Request, Response } from "express";
import { VideoType } from "./db";
import { db } from "./db";
import { availableResolutions } from "./core/resolutions";

export const setupApp = (app: Express) => {
    app.use(express.json());

    app.get('/videos', (req: Request, res: Response) => {
        res.status(200).send(db.videos)
    })

    app.get('/videos/:id', (req: Request, res: Response) => {
        const video: VideoType | undefined = db.videos.find(v => v.id === +req.params.id)
        if (video === undefined) {
            res.status(404).send({ message: "Video not found" })
        };
        res.status(200).send(video)
    }),

        app.post('/videos', (req: Request, res: Response) => {

            const newVideo: VideoType = {
                id: Number(new Date().toISOString()),
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: true,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: new Date().toISOString(),
                availableResolutions: [
                    availableResolutions.P144
                ]
            }
            res.status(201).send(newVideo);
        })

    app.put('/videos/:id', (req: Request, res: Response) => {
        const findVideo: VideoType | undefined= db.videos.find(v => v.id === +req.params.id);
        if(!findVideo){
            res.status(404).send({message: "Video not  found"})
        }

        findVideo.title = req.body.title || findVideo?.title;
    })



    return app;
}

