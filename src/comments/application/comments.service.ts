import { CommentsRepository } from "../infrastructure/comment.repository";
import { Result } from "../../core/result/result.type";
import { PostsRepository } from "../../posts/infrastructure/postRepository";
import { UsersRepository } from "../../users/infrastructure/users.repository";
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
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async createComment(
    dto: ContentDto,
  ): Promise<Result<{ commentId: string } | null>> {
    const user = await this.usersRepository.find(dto.userId);
    const post = await this.postsRepository.findPost(dto.postId);
    if (!post) {
      return handleNotFoundResult("Post not found", "postId");
    }
    if (!user) {
      return handleNotFoundResult("User not found", "userId");
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
    const commentId: string = await this.commentsRepository.create(newComment);

    return handleSuccessResult({ commentId: commentId });
  }

  async update(
    id: string,
    dto: CommentInputDto,
    userId: string,
  ): Promise<Result<void | null>> {
    const comment = await this.commentsRepository.findByCommentId(id);
    if (!comment) return handleNotFoundResult("comment not found", "commentId");
    if (comment.commentatorInfo.userId.toString() !== userId) {
      return handleForbiddenResult("access denied", "commentId");
    }
    await this.commentsRepository.update(id, dto);
    return handleSuccessResult();
  }

  async delete(id: string, userId: string): Promise<Result<void | null>> {
    const comment = await this.commentsRepository.findByCommentId(id);
    if (!comment) return handleNotFoundResult("comment not found", "commentId");
    if (comment.commentatorInfo.userId.toString() !== userId) {
      return handleForbiddenResult("access denied", "commentId");
    }
    await this.commentsRepository.delete(id);
    return handleSuccessResult();
  }
}
