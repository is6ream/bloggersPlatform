import { Request, Response } from "express";
import { postsService } from "../../../posts/application/post.service";
import { HttpStatus } from "../../../core/http-statuses";

export async function createPostByBlogId(req: Request, res: Response) {
  try {
    const { blogId } = req.params;
    const { title, shortDescription, content } = req.body;

    const newPost = await postsService.createPostByBlogId(blogId, {
      title,
      shortDescription,
      content,
    });
    if (newPost === null) {
      res.sendStatus(HttpStatus.NotFound);
    }
    res.status(201).json(newPost);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
