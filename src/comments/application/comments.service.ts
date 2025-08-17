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
  async update(id: string, dto: CommentInputDto): Promise<void> {
    commentsRepository.update(id, dto);
    return;
  },
  async delete(id: string): Promise<boolean> {
    return await commentsRepository.delete(id);
  },
};
