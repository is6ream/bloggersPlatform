import { Request, Response } from "express";
import { HttpStatus } from "../../core/types";
import { postRepository } from "../repositories/postRepository";

export function getAllPostsHandler(req: Request, res: Response) {
  const posts = postRepository.findAll();
  res.status(HttpStatus.Ok).json(posts);
}
