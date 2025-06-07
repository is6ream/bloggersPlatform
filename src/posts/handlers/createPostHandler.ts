import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { PostType } from "../types/posts-types";
import { HttpStatus } from "../../core/types";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";

export async function createPostHandler(req: Request, res: Response) {
  const foundBlog = await blogsRepository.findById(req.body.blogId);

  if (!foundBlog) {
    res.status(HttpStatus.NotFound).send("Blog not found");
    return;
  }
  const newPost: PostType = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: foundBlog.id,
    blogName: foundBlog.name,
    createdAt: req.body.createdAt,
  };

  postRepository.create(newPost);
  res.status(HttpStatus.Created).send(newPost);
}
