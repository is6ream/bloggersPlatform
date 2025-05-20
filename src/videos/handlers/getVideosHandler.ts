import { Request, Response } from "express";
import { db } from "../../db";


export const getVideosHandlers = {
    getAllVideos: ((req: Request, res: Response) => {
        const videos = db.videos;
        res
            .status(200)
            .json(videos)
    })

}