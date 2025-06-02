import { Request, Response } from "express";
import { HttpStatus } from "../../core/types";
import { postRepository } from "../repositories/postRepository";

export function deletePostHandler(req: Request, res: Response) {
  const id = req.params.id;
  postRepository.delete(id);
  res.status(HttpStatus.NoContent).send();
}
