import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { BlogType } from "../../types/blogs-types";
import { PostInputDto } from "../../../posts/types/posts-types";

export async function createPostByBlogId(req: Request, res: Response) {
  const { blogId } = req.params;
  const dto: PostInputDto = req.body;
}
