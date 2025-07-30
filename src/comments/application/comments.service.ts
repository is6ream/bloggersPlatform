import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { usersQueryRepository } from "../../users/repositories/user.query.repository";
import { usersRepository } from "../../users/repositories/users.repository";
import { commentsRepository } from "../repositories/comment.repository";
import { CommentInputType, ContentDto } from "../types/commentsTypes";

export const commentsService = {
  async createComment(
    userId: string,
    dto: ContentDto,
  ): Promise<Result<{ commentId: string } | null>> {
    const user = await usersRepository.findUserForCreateComment(userId);
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Not found",
        extensions: [{ message: "User not found", field: "user id" }],
        data: null,
      };
    }
    const newComment: CommentInputType = {
      postId: post
      content: dto.content,
      commentatorInfo: {
        userId: user!.id,
        userLogin: user!.login,
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
};
