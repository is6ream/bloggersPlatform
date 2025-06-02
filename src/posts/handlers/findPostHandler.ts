import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";

export function findPostHandler(req: Request, res: Response) {
  const post = postRepository.findById(req.params.id);
  if (!post) {
    res.status(404).send("Post not found!");
  }
  res.status(200).send(post);
}
