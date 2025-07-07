import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/error.utils";
import { postsService } from "../application/post.service";

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const result = await postsService.delete(id);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Post not found" }])
        );
      return;
    } else {
      res.status(HttpStatus.NoContent).send();
      return;
    }
  } catch (error: unknown) {
    // console.log(error);
    res.sendStatus(HttpStatus.NoContent);
    return;
  }
}
