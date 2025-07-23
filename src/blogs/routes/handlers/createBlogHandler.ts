import { Request, Response } from "express";
import { CreateBlogDto } from "../../types/blogs-types";
import { blogsService } from "../../application/blogs.service";

export async function createBlogHandler(req: Request, res: Response) {
  const dataForResponse = await blogsService.create({
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    isMembership: false,
  });
  res.status(201).send(dataForResponse);
}
