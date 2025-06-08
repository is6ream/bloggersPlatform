import { Request, Response } from "express";
import { HttpStatus } from "../../core/types";
import { postRepository } from "../repositories/postRepository";

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await postRepository.delete(id);
    res.status(HttpStatus.NoContent).send();
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.NoContent);
    return;
  }
}
