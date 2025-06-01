import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { BlogType } from "../types/blogs-types";

function generateNumericId(length = 10) {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
  return randomNumber.toString().padStart(length, "0");
}
export function createBlogHandler(req: Request, res: Response) {
  const newBlog: BlogType = {
    id: generateNumericId(),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  blogsRepository.create(newBlog);
  res.status(201).send(newBlog);
}
