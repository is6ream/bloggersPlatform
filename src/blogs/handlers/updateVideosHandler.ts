import { BlogType } from "../../core/video-types";
import { db } from "../../db";
import { Request, Response } from "express";

export function updateVideoHandler(req: Request, res: Response) {
  const findBlog: BlogType | undefined = db.blogs.find(
    (b) => b.id === +req.params.id
  );
  if (!findBlog) {
    res.status(404).send({ message: "Video not found!" });
    return;
  }
  findBlog.name = req.body.name || findBlog.name;
  findBlog.description = req.body.description || findBlog.description;
  findBlog.websiteUrl = req.body.websiteUrl || findBlog.websiteUrl;

  res.status(204).send();
}
