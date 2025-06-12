import { postRepository } from "../repositories/postRepository";
import { HttpStatus } from "../../core/http-statuses";
import { Request, Response } from "express";

export async function deleteAllPosts(req: Request, res: Response) {
  await postRepository.deleteAll();
  res.status(HttpStatus.NoContent).send();
  return;
}
