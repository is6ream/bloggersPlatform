import { Request, Response } from "express";
import { postsService } from "../../../posts/application/post.service";

export async function createPostByBlogId(req: Request, res: Response) {
  const { blogId } = req.params;
  const { title, shortDescription, content } = req.body;

  const newPost = await postsService.createPostByBlogId(blogId, {
    title,
    shortDescription,
    content,
  });

  res.status(201).json(newPost);
}
