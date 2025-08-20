import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postsService } from "../application/post.service";
import { ResultStatus } from "../../core/result/resultCode";

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const result = await postsService.delete(id);
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
