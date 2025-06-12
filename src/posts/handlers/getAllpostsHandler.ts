import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postRepository } from "../repositories/postRepository";

export async function getAllPostsHandler(req: Request, res: Response) {
  const posts = await postRepository.findAll();
  res.status(HttpStatus.Ok).json(posts);
}
