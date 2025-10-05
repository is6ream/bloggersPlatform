import { Result } from "../../core/result/result.type";
import { postRepository } from "../../posts/infrastructure/postRepository";
import { usersRepository } from "../../users/infrastructure/users.repository";
import { commentsRepository } from "../infrastructure/comment.repository";
import {
  CommentInputType,
  ContentDto,
  CommentInputDto,
} from "../types/commentsTypes";
import {
  handleForbiddenResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";

class CommentsService {
  async createComment(
    dto: ContentDto,
  ): Promise<Result<{ commentId: string } | null>> {
    const user = await usersRepository.find(dto.userId); //здесь пофиксить
    const post = await postRepository.findPost(dto.postId);
    if (!post) {
      return handleNotFoundResult("Post not found", "postId");
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

    return handleSuccessResult({ commentId: commentId });
  }

  async update(
    id: string,
    dto: CommentInputDto,
    userId: string,
  ): Promise<Result<void | null>> {
    const comment = await commentsRepository.findByCommentId(id);
    if (!comment) return handleNotFoundResult("comment not found", "commentId");
    if (comment.commentatorInfo.userId.toString() !== userId) {
      return handleForbiddenResult("access denied", "commentId");
    }
    await commentsRepository.update(id, dto);
    return handleSuccessResult();
  }

  async delete(id: string, userId: string): Promise<Result<void | null>> {
    const comment = await commentsRepository.findByCommentId(id);
    if (!comment) return handleNotFoundResult("comment not found", "commentId");
    if (comment.commentatorInfo.userId.toString() !== userId) {
      return handleForbiddenResult("access denied", "commentId");
    }
    await commentsRepository.delete(id);
    return handleSuccessResult();
  }
}
export const commentsService = new CommentsService();
