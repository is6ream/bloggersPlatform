import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postQueryRepository } from "../infrastructure/postQueryRepository";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { PostQueryInput } from "../input/post-query.input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { mapToPostListPaginatedOutput } from "../mappers/map-to-post-list-paginated-output.util";
import { postsService } from "../application/post.service";
import { createErrorMessages } from "../../core/middlewares/validation/input-validation-result.middleware";
import { RequestWithParamsAndBodyAndUserId } from "../../core/types/common/requests";
import { PostId } from "../../comments/types/commentsTypes";
import { IdType } from "../../core/types/authorization/id";
import { commentsService } from "../../comments/application/comments.service";
import { commentsQueryRepository } from "../../comments/infrastructure/commentsQueryRepository";
import { CommentsQueryInput } from "../../comments/types/input/comment-Query-Input";
import { mapToCommentListPaginatedOutput } from "../../comments/mappers/mapToCommentListPaginatedOutput";

class PostsController {
  async createPost(req: Request, res: Response) {
    try {
      const result = await postsService.create({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
      });
      if (result.status !== ResultStatus.Success) {
        res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions);
        return;
      }
      const newPost = await postQueryRepository.findById(result.data!);
      res.status(HttpStatus.Created).send(newPost.data!);
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deletePost(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;

      const result = await postsService.delete(id);
      if (result.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      res.sendStatus(HttpStatus.NoContent);
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }

  async findPost(req: Request, res: Response) {
    try {
      const post = await postQueryRepository.findById(req.params.id);
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
        await postQueryRepository.findAll(queryInput);

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

  async updatePost(req: Request, res: Response) {
    try {
      const result = await postsService.update(req.params.id, req.body);
      if (result.status !== ResultStatus.Success) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: "id", message: "Post not found" }]),
          );
        return;
      }
      res.sendStatus(HttpStatus.NoContent);
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }

  async createComment(
    req: RequestWithParamsAndBodyAndUserId<PostId, { content: string }, IdType>,
    res: Response,
  ) {
    try {
      const userId = req.userId as string;
      if (!userId) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
      }
      const content = {
        comment: req.body.content,
        userId: userId,
        postId: req.params.id,
      };
      const result = await commentsService.createComment(content);
      if (result.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.NotFound);
      }
      const comment = await commentsQueryRepository.findById(
        result.data!.commentId,
      );
      res.status(HttpStatus.Created).send(comment);
      return;
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
      const foundPost = await postQueryRepository.findById(postId);
      if (foundPost.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      const { items, totalCount } =
        await commentsQueryRepository.findCommentByPostId(queryInput, postId);

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

export const postController = new PostsController();
