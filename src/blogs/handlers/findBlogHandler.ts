import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";
import { BlogType } from "../types/blogs-types";
import { createErrorMessages } from "../../core/error.utils";

export async function findBlogHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    if (typeof id !== "string" || id.length !== 24) {
      res.status(400).send({ error: "Invalid object ID format" });
      return;
    }

    const blog: BlogType | null = await blogsRepository.findById(id);

    if (blog === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Blog not found" }]),
        );
      return;
    }
    res.status(200).json(blog);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
