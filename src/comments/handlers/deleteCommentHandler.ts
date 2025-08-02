import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { commentsService } from "../application/comments.service";
export async function deleteCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const isDeleted = await commentsService.delete(id);
    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound);
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
