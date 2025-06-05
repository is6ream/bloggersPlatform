import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { HttpStatus } from "../../core/types";

export async function updatePostHandler(req: Request, res: Response) {
  await postRepository.update(req.params.id, req.body);
  res.status(HttpStatus.NoContent).send();
}
