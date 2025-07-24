import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { blogQueryRepository } from "../../repositories/blogs.query.repository";

export async function createBlogHandler(req: Request, res: Response) {
  const createdBlogId = await blogsService.create({
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  });

  const blogForResponse = await blogQueryRepository.findByBlogId(createdBlogId);
  res.status(201).send(blogForResponse);

  
}
