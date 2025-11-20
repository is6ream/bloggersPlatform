import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { PostsService } from "../application/post.service";
import { createErrorMessages } from "../../core/middlewares/validation/input-validation-result.middleware";
import {
  RequestWithParamsAndBody,
  RequestWithParamsAndBodyAndUserId,
} from "../../core/types/common/requests";
import { ContentDto, PostId } from "../../comments/types/commentsTypes";
import { IdType } from "../../core/types/authorization/id";
import { CommentsService } from "../../comments/application/comments.service";
import { CommentsRepository } from "../../comments/infrastructure/comment.repository";
import { PostsRepository } from "../infrastructure/postRepository";
import { inject, injectable } from "inversify";
import {
  LikeStatusRequest,
  PostLikeStatusDto,
} from "../../likes/likeStatusType";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) private postsService: PostsService,
    @inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
  ) {}

  async createPost(req: Request, res: Response) {
    try {
      const createPostDto = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
      };
      const result = await this.postsService.create(createPostDto);
      if (result.status !== ResultStatus.Success) {
        res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions);
        return;
      }
      const newPostId = result.data;
      if (!newPostId) {
        res.sendStatus(HttpStatus.BadRequest);
        return;
      }
      const userId = req.userId;
      const newPost = await this.postsRepository.findById(newPostId, userId);
      res.status(HttpStatus.Created).send(newPost);
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deletePost(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;

      const result = await this.postsService.delete(id);
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

  async updatePost(req: Request, res: Response) {
    try {
      const result = await this.postsService.update(req.params.id, req.body);
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
      const content: ContentDto = {
        comment: req.body.content,
        userId: userId,
        postId: req.params.id,
      };
      const result = await this.commentsService.createComment(content);
      if (result.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      const commentId = result.data?.commentId;
      if (!commentId) {
        res.sendStatus(HttpStatus.BadRequest);
        return;
      }
      const comment = await this.commentsRepository.findById(commentId);
      console.log(comment, "comment check in API");
      res.status(HttpStatus.Created).send(comment);
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async updateLikeStatus(
    req: RequestWithParamsAndBody<{ id: string }, LikeStatusRequest>,
    res: Response,
  ) {
    try {
      if (!req.userId) {
        return res.status(HttpStatus.Unauthorized);
      }
      const dto: PostLikeStatusDto = {
        status: req.body.likeStatus,
        postId: req.params.id,
        userId: req.userId,
      };

      const result = await this.postsService.updateLikeForPostStatus(dto);
      if (result.status !== ResultStatus.Success) {
        res.status(HttpStatus.NotFound).send(result.extensions);
        return;
      }
      res.sendStatus(HttpStatus.NoContent);
      return;
    } catch (err: unknown) {
      console.log(err);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }
}
