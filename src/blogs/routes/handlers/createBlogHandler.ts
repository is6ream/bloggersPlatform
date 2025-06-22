import { Request, Response } from "express";
import { BlogType } from "../../types/blogs-types";
import { blogsService } from "../../application/blogs.service";

export async function createBlogHandler(req: Request, res: Response) {
  const newBlog: BlogType = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };

  const dataForResponse = await blogsService.create(newBlog);
  res.status(201).send(dataForResponse);
}
