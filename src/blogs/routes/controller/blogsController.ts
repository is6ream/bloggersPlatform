import { Request, Response } from "express";
import { BlogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../core/http-statuses";
import { PostsService } from "../../../posts/application/post.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { createErrorMessages } from "../../../core/errors/create-error-message";

import { BlogsRepository } from "../../infrastructure/blogs.repository";
import { PostsRepository } from "../../../posts/infrastructure/postRepository";

export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}
  async createBlog(req: Request, res: Response) {
    try {
      const createdBlogId = await this.blogsService.create({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
      });

      const blog = await this.blogsRepository.findById(createdBlogId);
      res.status(HttpStatus.Created).send(blog);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async createPostByBlogId(req: Request, res: Response): Promise<void> {
    try {
      const { id: id } = req.params;
      const result = await this.postsService.createPostByBlogId(id, req.body);
      if (result.status !== ResultStatus.Success) {
        res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions); //при неверно введенном id тут падает 500 ошибка, должна быть 404
        return;
      }
      const resultId = result.data;
      const post = await this.postsRepository.findPost(resultId!);
      res.status(HttpStatus.Created).send(post.data);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deleteBlog(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;

      const result = await this.blogsService.delete(id);
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

  async updateBlog(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateResult = await this.blogsService.update(id, req.body);
      if (updateResult === null) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: "id", message: "Blog not found" }]),
          );
        return;
      }
      res.status(HttpStatus.NoContent).send();
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }
}
