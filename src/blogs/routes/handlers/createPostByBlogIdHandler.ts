import { Request, Response } from "express";
import { postsService } from "../../../posts/application/post.service";
import { HttpStatus } from "../../../core/http-statuses";
import { createErrorMessages } from "../../../core/errors/create-error-message";
export async function createPostByBlogId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id: id } = req.params;
    const { title, shortDescription, content } = req.body;

    const newPost = await postsService.createPostByBlogId(id, {
      title,
      shortDescription,
      content,
    });
    if (newPost === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "blog not found!" }]),
        );
      return;
    }
    res.status(201).json(newPost);
  } catch (error: unknown) {
    // console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
