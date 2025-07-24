import { Request, Response } from "express";
import { PostInputDto, PostType } from "../types/posts-types";
import { HttpStatus } from "../../core/http-statuses";
import { blogQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { postQueryRepository } from "../repositories/postQueryRepository";
import { postsService } from "../application/post.service";

export class NotFoundExeption extends Error {
  public statusCode = 404;

  constructor(message: string = "Not found") {
    super(message);
    this.name = "NotFoundExeption";
  }
}

export async function createPostHandler(req: Request, res: Response) {
  try {
    const dataForResponse: PostInputDto = await postsService.create({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    });
    res.status(204).send(dataForResponse);
  } catch (err: unknown) {
    if (err instanceof NotFoundExeption) {
      res.status(HttpStatus.NotFound).send("Blog not found!"); //не хватает финального обработчика
    } else {
      res.status(HttpStatus.InternalServerError).send("Error");
    }
  }
}

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

  const createdPostId = await postsService.create(newPost);
  const postForResponse = await postQueryRepository.findById(createdPostId);

  res.status(HttpStatus.Created).send(postForResponse);
}
