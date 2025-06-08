import { Request, Response } from "express";
import { HttpStatus } from "../../core/types";
import { postRepository } from "../repositories/postRepository";

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await postRepository.delete(id);
    if (result === null) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.NoContent);
    return;
  }
}
