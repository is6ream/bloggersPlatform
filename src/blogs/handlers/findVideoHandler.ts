import { Request, Response } from "express";
import { db } from "../../db";
import { BlogType } from "../../core/video-types";

export function findBlogHandler(req: Request, res: Response) {
  const findBlog: BlogType | undefined = db.blogs.find(
    (b) => b.id === +req.params.id,
  );
  if (!findBlog) {
    res.status(404).send({ message: "Video not found!" });
  }
  res.status(200).send(findBlog);
}
