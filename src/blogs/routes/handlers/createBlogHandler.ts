import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { blogQueryRepository } from "../../repositories/blogs.query.repository";
import { HttpStatus } from "../../../core/http-statuses";

export async function createBlogHandler(req: Request, res: Response) {
  try {
    const createdBlogId = await blogsService.create({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    });

    const blogForResponse =
      await blogQueryRepository.findByBlogId(createdBlogId);
    res.status(HttpStatus.Created).send(blogForResponse);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
