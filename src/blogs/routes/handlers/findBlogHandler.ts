import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { BlogType } from "../../types/blogs-types";
import { blogQueryRepository } from "../../repositories/blogs.query.repository";
import { createErrorMessages } from "../../../core/errors/create-error-message";

export async function findBlogHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const blog: BlogType | null = await blogQueryRepository.findById(id);

    if (blog === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Blog not found" }])
        );
      return;
    }
    res.status(200).json(blog);
    return;
  } catch (error: unknown) {
    // console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
