import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { HttpStatus } from "../../core/types";

export function findPostHandler(req: Request, res: Response) {
  const post = postRepository.findById(req.params.id);
  if (!post) {
    res.status(HttpStatus.NotFound).send("Post not found!");
  }
  res.status(HttpStatus.Ok).send(post);
}
