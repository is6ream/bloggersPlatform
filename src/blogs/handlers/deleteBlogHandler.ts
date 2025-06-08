import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";
import { createErrorMessages } from "../../core/error.utils";

export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (typeof id !== "string" || id.length !== 24) {
      res.status(404).send({ error: "Invalid object ID format" });
    }
    const result = await blogsRepository.delete(id);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Blog not found" }]),
        );
    } else {
      res.status(HttpStatus.NoContent).send();
    }
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
