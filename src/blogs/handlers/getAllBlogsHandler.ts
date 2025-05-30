import { BlogType } from "../../core/blogs-types";
import { db } from "../../db";
import { Request, Response } from "express";

export function getAllBlogsHandler(req: Request, res: Response) {
  const blogs: BlogType[] = db.blogs;
  res.status(200).json(blogs);
}
