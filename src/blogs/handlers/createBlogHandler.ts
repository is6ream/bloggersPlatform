import { Request, Response } from "express";
import { createInputValidation } from "../validation/create-update.validation";
import { blogsRepository } from "../repositories/blogs.repository";
import { BlogType } from "../../core/blogs-types";

export function createBlogHandler(req: Request, res: Response) {
  const errors = createInputValidation(req.body);

  if (errors.errorsMessages.length) {
    res.status(400).json(errors);
    return;
  }
  const newBlog: BlogType = {
    id: new Date().toISOString(),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  blogsRepository.create(newBlog);
  res.status(201).send(newBlog);
}
