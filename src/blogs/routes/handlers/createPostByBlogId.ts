import { Request, Response } from "express";
import { BlogType } from "../../types/blogs-types";
import { postsService } from "../../../posts/application/post.service";

export async function createPostByBlogId(req: Request, res: Response) {
  const { blogId } = req.params;

  const newPost: BlogType = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };

  const dataForResponse = await postsService.create(newPost, blogId);
  res.status(201).send(dataForResponse);
}
