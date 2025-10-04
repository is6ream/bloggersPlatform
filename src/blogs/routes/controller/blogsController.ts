import { Request, Response } from "express";
import { blogsService } from "../../domain/blogs.service";
import { blogQueryRepository } from "../../infrastructure/blogs.query.repository";
import { HttpStatus } from "../../../core/http-statuses";
import { postsService } from "../../../posts/application/post.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { postQueryRepository } from "../../../posts/repositories/postQueryRepository";
import { BlogViewModel } from "../../types/blogs-types";
import { createErrorMessages } from "../../../core/errors/create-error-message";
import { BlogQueryInput } from "../input/blog-query.input";
import { setDefaultPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { mapToBlogListPaginatedOutput } from "../mappers/map-to-blog-list-paginated-output.util";
import { PostQueryInput } from "../../../posts/input/post-query.input";
import { mapToPostListPaginatedOutput } from "../../../posts/mappers/map-to-post-list-paginated-output.util";
import { blogsRepository } from "../../infrastructure/blogs.repository";

class BlogsController {
  async createBlog(req: Request, res: Response) {
    try {
      const createdBlogId = await blogsService.create({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
      });

      const blog = await blogQueryRepository.findByBlogId(createdBlogId);
      res.status(HttpStatus.Created).send(blog);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async createPostByBlogId(req: Request, res: Response): Promise<void> {
    try {
      const { id: id } = req.params;
      const result = await postsService.createPostByBlogId(id, req.body);
      if (result.status !== ResultStatus.Success) {
        res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions); //при неверно введенном id тут падает 500 ошибка, должна быть 404
        return;
      }
      const resultId = result.data;
      const post = await postQueryRepository.findById(resultId!);
      res.status(HttpStatus.Created).send(post.data);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deleteBlog(req: Request<{ id: string }>, res: Response) {
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

  async findBlog(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const blog: BlogViewModel | null = await blogQueryRepository.findById(id);

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
      return;
    }
  }

  async getAllBlogs(req: Request<{}, {}, {}, BlogQueryInput>, res: Response) {
    try {
      const queryInput = setDefaultPaginationIfNotExist(req.query);

      const { items, totalCount } =
        await blogQueryRepository.findAll(queryInput);

      const blogsListOutput = mapToBlogListPaginatedOutput(items, {
        pageNumber: Number(queryInput.pageNumber),
        pageSize: Number(queryInput.pageSize),
        totalCount,
      });

      res.status(HttpStatus.Ok).send(blogsListOutput);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }
  async getPostsByBlogId(req: Request, res: Response): Promise<void> {
    try {
      const queryInput: PostQueryInput = setDefaultPaginationIfNotExist(
        req.query,
      );
      const { id: blogId } = req.params;
      const foundBlog = await blogQueryRepository.findById(blogId);
      if (!foundBlog) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      const { items, totalCount } = await postQueryRepository.findPostsByBlogId(
        queryInput,
        blogId,
      );

      const postsListOutput = mapToPostListPaginatedOutput(items, {
        pageNumber: Number(queryInput.pageNumber),
        pageSize: Number(queryInput.pageSize),
        totalCount,
      });
      res.status(200).send(postsListOutput);
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateResult = await blogsRepository.update(id, req.body);
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

export const blogController = new BlogsController();
