import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postsService } from "../application/post.service";

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;

    const isDeleted = await postsService.delete(id);
    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound);
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
