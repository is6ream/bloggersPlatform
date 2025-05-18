import express, { Express } from "express"
import { VideoType } from "./db";
import { db } from "./db";

export const setupApp = (app: Express) => {
    app.use(express.json());

    app.get('/videos', (req, res) => {
        res.status(200).send(db.videos)
    })

    app.get('videos:id', (req, res) => {
        const video = db.videos.find((video) => video.id === req.params.id);
        if (!video) {
            res.status(404).send({ message: "Video not found" })
        };
        res.status(200).send(video)

    })

    return app;
}

