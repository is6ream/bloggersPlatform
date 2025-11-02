import { CommentsRepository } from "../infrastructure/comment.repository";
import { Result } from "../../core/result/result.type";
import { PostsRepository } from "../../posts/infrastructure/postRepository";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { ContentDto, CommentInputDto } from "../types/commentsTypes";
import {
  handleForbiddenResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { injectable, inject } from "inversify";
import { CommentModel } from "../types/mongoose/mongoose";
import { LikeStatusDto } from "../likes/likeStatusType";
import { ObjectId } from "mongodb";
import { LikeModel } from "../likes/likesMongoose";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(UsersRepository) private usersRepository: UsersRepository,
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
    const newComment = new CommentModel();
    newComment.content = dto.comment;
    newComment.commentatorInfo = {
      userId: user.id,
      userLogin: user.login,
    };
    newComment.postId = post.id;

    console.log(post.id, "postId check in BLL");
    console.log(newComment, "comment entity check in BLL");
    const commentId: string = await this.commentsRepository.create(newComment);

    return handleSuccessResult({ commentId: commentId });
  }

  async update(
    id: string,
    dto: CommentInputDto,
    userId: string,
  ): Promise<Result<void | null>> {
    const comment = await this.commentsRepository.getCommentDocument(id); //тут нужно через репозиторий сходить
    if (!comment) return handleNotFoundResult("comment not found", "commentId");
    if (comment.commentatorInfo.userId.toString() !== userId) {
      return handleForbiddenResult("access denied", "commentId");
    }
    comment.content = dto.content;
    await this.commentsRepository.update(comment);
    return handleSuccessResult();
  }

  async delete(id: string, userId: string): Promise<Result<void | null>> {
    const comment = await this.commentsRepository.findById(id);
    if (!comment) return handleNotFoundResult("comment not found", "commentId");
    if (comment.commentatorInfo.userId.toString() !== userId) {
      return handleForbiddenResult("access denied", "commentId");
    }
    await this.commentsRepository.delete(id);
    return handleSuccessResult();
  }

  async updateLikeStatus(dto: LikeStatusDto): Promise<Result<any>> {
    const comment = CommentModel.findOne({ _id: new ObjectId(dto.commentId) });
    if (!comment) {
      return handleNotFoundResult("Comment not found", "commentId");
    }
    const like = LikeModel.findOne({ _id: new ObjectId(dto.userId) }).lean();
  }
}
