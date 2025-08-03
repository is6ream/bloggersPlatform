import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { postRepository } from "../../posts/repositories/postRepository";
import { usersRepository } from "../../users/repositories/users.repository";
import { commentsRepository } from "../repositories/comment.repository";
import {
  CommentInputType,
  ContentDto,
  CommentInputDto,
} from "../types/commentsTypes";

export const commentsService = {
  async createComment(
    dto: ContentDto,
  ): Promise<Result<{ commentId: string } | null>> {
    const user = await usersRepository.findUserForCreateComment(dto.userId);
    const post = await postRepository.findPostForCreateComment(dto.postId);
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Not found",
        extensions: [{ message: "User not found", field: "user id" }],
        data: null,
      };
    }
    const newComment: CommentInputType = {
      postId: post,
      content: dto.comment,
      commentatorInfo: {
        userId: user.id,
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
  async update(id: string, dto: CommentInputDto): Promise<void> {
    commentsRepository.update(id, dto);
    return;
  },
  async delete(id: string): Promise<boolean> {
    return await commentsRepository.delete(id);
  },
};
