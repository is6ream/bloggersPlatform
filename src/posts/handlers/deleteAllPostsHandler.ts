import { postRepository } from "../repositories/postRepository";
import { HttpStatus } from "../../core/types";
import { Request, Response } from "express";

export async function deleteAllPosts(req: Request, res: Response) {
  await postRepository.deleteAll();
  res.status(HttpStatus.NoContent).send();
  return;
}
