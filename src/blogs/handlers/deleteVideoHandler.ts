import { Request, Response } from "express";
import { BlogType } from "../../core/video-types";
import { db } from "../../db";

export function deleteBlogHandler(req: Request, res: Response) {
  const id = +req.params.id;
  const findBlog: BlogType | undefined = db.blogs.find((b) => b.id === id);

  if (findBlog) {
    res.status(404).json({ message: "Video not found!" });
  }
  db.blogs = db.blogs.filter((b) => b.id !== id);
  res.status(204).send();
}
