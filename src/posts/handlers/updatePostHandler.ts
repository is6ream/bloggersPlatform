import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { HttpStatus } from "../../core/types";

export async function updatePostHandler(req: Request, res: Response) {
  try {
    await postRepository.update(req.params.id, req.body);
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
