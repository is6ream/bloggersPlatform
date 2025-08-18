import { CommentQueryOtput } from "./../types/commentsTypes";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { postRepository } from "../../posts/repositories/postRepository";
import { usersQueryRepository } from "../../users/repositories/user.query.repository";
import { usersRepository } from "../../users/repositories/users.repository";
import { commentsRepository } from "../repositories/comment.repository";
import {
  CommentInputType,
  ContentDto,
  CommentInputDto,
} from "../types/commentsTypes";

export const commentsService = {
  async createComment(
    dto: ContentDto
  ): Promise<Result<{ commentId: string } | null>> {
    const user = await usersRepository.findUser(dto.userId);
    const post = await postRepository.findPost(dto.postId);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Not found",
        extensions: [{ message: "Post not found", field: "post id" }],
        data: null,
      };
    }
    const newComment: CommentInputType = {
      postId: post._id.toString(),
      content: dto.comment,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: user.login,
      },
      createdAt: new Date(),
    };
    const commentId: string = await commentsRepository.create(newComment);

    return {
      status: ResultStatus.Success,
      data: { commentId },
      extensions: [],
    };
  },

  async update(
    id: string,
    dto: CommentInputDto,
    userId: string,
  ): Promise<Result<void | null>> {
    const commentId = await commentsRepository.findByCommentId(id);
    if (commentId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Access denied",
        extensions: [{ message: "Access denied", field: "comment id" }],
        data: null,
      };
    }
    const result = await commentsRepository.update(id, dto);
    if (!result) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Not found",
        extensions: [{ message: "Comment not found", field: "comment id" }],
        data: null,
      };
    }
    return {
      status: ResultStatus.Success,
      extensions: [],
    };
  },

  async delete(id: string): Promise<boolean> {
    return await commentsRepository.delete(id);
  },
};
