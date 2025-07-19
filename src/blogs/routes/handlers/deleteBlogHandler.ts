import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { createErrorMessages } from "../../../core/errors/create-error-message";
import { blogsService } from "../../application/blogs.service";
export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;

    const result = await blogsService.delete(id);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Blog not found" }])
        );
      return;
    } else {
      res.status(HttpStatus.NoContent).send();
      return;
    }
  } catch (error: unknown) {
    // console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
