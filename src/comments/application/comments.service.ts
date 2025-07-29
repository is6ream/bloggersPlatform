import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { usersQueryRepository } from "../../users/repositories/user.query.repository";
import { commentsRepository } from "../repositories/comment.repository";
import { CommentInputType, ContentDto } from "../types/commentsTypes";

export const commentsService = {
  async createComment(
    userId: string,
    dto: ContentDto,
  ): Promise<Result<{ commentId: string } | null>> {
    const checkUser = await usersQueryRepository.findById(userId);
    if (!checkUser) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Not found",
        extensions: [{ message: "User not found", field: "user id" }],
        data: null,
      };
    }
    const newComment: CommentInputType = {
      content: dto.content,
      commentatorInfo: {
        userId: checkUser!.id,
        userLogin: checkUser!.login,
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
