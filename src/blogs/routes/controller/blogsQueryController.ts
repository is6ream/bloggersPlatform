import { BlogsQueryRepository } from "../../infrastructure/blogs.query.repository";
import { Request, Response } from "express";
import { BlogQueryInput } from "../input/blog-query.input";
import { setDefaultPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { mapToBlogListPaginatedOutput } from "../mappers/map-to-blog-list-paginated-output.util";
import { HttpStatus } from "../../../core/http-statuses";
import { BlogViewModel } from "../../types/blogs-types";
import { createErrorMessages } from "../../../core/errors/create-error-message";
import { PostsQueryRepository } from "../../../posts/infrastructure/postQueryRepository";
import { mapToPostListPaginatedOutput } from "../../../posts/mappers/map-to-post-list-paginated-output.util";
import { PostQueryInput } from "../../../posts/input/post-query.input";
import { injectable, inject } from "inversify";

@injectable()
export class BlogsQueryController {
  constructor(
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository
  ) {}

  async findBlog(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const blog: BlogViewModel | null =
        await this.blogsQueryRepository.findById(id);

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
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }

  async getAllBlogs(req: Request<{}, {}, {}, BlogQueryInput>, res: Response) {
    try {
      const queryInput = setDefaultPaginationIfNotExist(req.query);

      const { items, totalCount } =
        await this.blogsQueryRepository.findAll(queryInput);

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
      const userId = req.userId;
      const foundBlog = await this.blogsQueryRepository.findById(blogId);
      if (!foundBlog) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      const { items, totalCount } =
        await this.postsQueryRepository.findPostsByBlogId(
          queryInput,
          blogId,
          userId,
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
}
