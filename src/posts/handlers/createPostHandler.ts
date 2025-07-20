import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { PostType } from "../types/posts-types";
import { HttpStatus } from "../../core/http-statuses";
import { blogQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";

export async function createPostHandler(req: Request, res: Response) {
  const foundBlog = await blogQueryRepository.findById(req.body.blogId);

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
    createdAt: new Date().toISOString(),
  };

  const dataForResponse = await postRepository.create(newPost);
  res.status(HttpStatus.Created).send(dataForResponse);
}
