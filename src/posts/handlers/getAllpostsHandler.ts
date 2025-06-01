import { Request, Response } from "express";
import { HttpStatus } from "../../core/types";

export function getAllPostsHandler(req: Request, res: Response) {
  const posts = postRepository.findAll();
  res.status(HttpStatus.Ok).json(posts);
}
