import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { BlogType } from "../types/blogs-types";

export async function createBlogHandler(req: Request, res: Response) {
  const newBlog: BlogType = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };

  const dataForResponse = await blogsRepository.create(newBlog);
  res.status(201).send(dataForResponse);
}
