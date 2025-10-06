import { commentsQueryRepository } from "../../comments/infrastructure/commentsQueryRepository";
import {
  postQueryRepository,
  PostQueryRepository,
} from "../infrastructure/postQueryRepository";
import { Request, Response } from "express";
import { ResultStatus } from "../../core/result/resultCode";
import { HttpStatus } from "../../core/http-statuses";
import { PostQueryInput } from "../input/post-query.input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { mapToPostListPaginatedOutput } from "../mappers/map-to-post-list-paginated-output.util";
import { CommentsQueryInput } from "../../comments/types/input/comment-Query-Input";
import { CommentsQueryRepository } from "../../comments/infrastructure/commentsQueryRepository";
import { mapToCommentListPaginatedOutput } from "../../comments/mappers/mapToCommentListPaginatedOutput";

class PostsQueryController {
  constructor(
    private postQueryRepository: PostQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async findPost(req: Request, res: Response) {
    try {
      const post = await this.postQueryRepository.findById(req.params.id);
      if (post.status !== ResultStatus.Success) {
        res.status(HttpStatus.NotFound).send("Post not found!");
        return;
      }
      res.status(HttpStatus.Ok).send(post.data);
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const queryInput: PostQueryInput = setDefaultPaginationIfNotExist(
        req.query,
      );

      const { items, totalCount } =
        await this.postQueryRepository.findAll(queryInput);

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

  async getCommentByPostId(req: Request, res: Response): Promise<void> {
    try {
      const queryInput: CommentsQueryInput = setDefaultPaginationIfNotExist(
        req.query,
      );
      const { id: postId } = req.params;
      const foundPost = await this.postQueryRepository.findById(postId);
      if (foundPost.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      const { items, totalCount } =
        await this.commentsQueryRepository.findCommentByPostId(
          queryInput,
          postId,
        );

      const commentsListOutput = mapToCommentListPaginatedOutput(items, {
        pageNumber: Number(queryInput.pageNumber),
        pageSize: Number(queryInput.pageSize),
        totalCount,
      });
      res.status(HttpStatus.Ok).send(commentsListOutput);
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }
}

export const postsQueryController = new PostsQueryController(
  postQueryRepository,
  commentsQueryRepository,
);
