import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/errors/create-error-message";
import { postsService } from "../application/post.service";
import { ResultStatus } from "../../core/result/resultCode";

export async function updatePostHandler(req: Request, res: Response) {
  try {
    const result = await postsService.update(req.params.id, req.body);
    if (result.status !== ResultStatus.Success) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Post not found" }]),
        );
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
