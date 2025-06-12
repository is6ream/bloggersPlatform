import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { HttpStatus } from "../../core/http-statuses";

export async function findPostHandler(req: Request, res: Response) {
  try {
    const post = await postRepository.findById(req.params.id);
    if (!post) {
      res.status(HttpStatus.NotFound).send("Post not found!");
    }
    res.status(HttpStatus.Ok).send(post);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
