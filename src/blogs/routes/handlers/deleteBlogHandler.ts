import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { blogsService } from "../../application/blogs.service";
import { ResultStatus } from "../../../core/result/resultCode";
export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const result = await blogsService.delete(id);
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatus.NotFound);
    }
    res.status(HttpStatus.NoContent).send();
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
