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
import { CommentDocument, CommentModel } from "../types/mongoose/mongoose";
import { LikeStatusDto } from "../likes/likeStatusType";
import { LikeModel, LikeStatus } from "../likes/likesMongoose";
import { ObjectId } from "mongodb";

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
    const commentId: string = await this.commentsRepository.save(newComment);

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

  async updateLikeStatus(dto: LikeStatusDto): Promise<Result<void | null>> {
    let like = await LikeModel.findOne({
      userId: dto.userId,
      commentId: dto.commentId,
    }); //ищем лайк
    let comment = await CommentModel.findOne({
      //ищем коммент
      _id: new ObjectId(dto.commentId),
    });
    if (!comment) {
      //если коммента нет - выбрасываем ошибку
      return handleNotFoundResult("comment not found", "commentId");
    }
    if (!like) {
      //если лайк пока не создан, мы создаем новую сущность, инкрементируем счетчик реакций и сохраняем в бд
      like = new LikeModel();
      like.status = dto.status;
      like.userId = dto.userId;
      like.commentId = dto.commentId;
      await this.commentsRepository.likeStatusSave(like);
      console.log(comment, "comment check");
      console.log(like.status, "like status check");
      console.log(dto.status, "dto status check"); //данные передаются, но счетчик не инкерментируется
      await this.likesCount(comment, "None" as LikeStatus, dto.status); //здесь лайк должен инкерементироваться
      return handleSuccessResult();
    }
    if (like.status === dto.status) {
      return handleSuccessResult();
    }
    let oldLikeStatus = like.status;
    like.status = dto.status;
    like.createdAt = new Date();
    console.log(like.status, "like status check");
    await this.likesCount(comment, oldLikeStatus, dto.status);
    await this.commentsRepository.likeStatusSave(like);
    return handleSuccessResult();
  }

  private async likesCount(
    comment: CommentDocument,
    oldLikeStatus: LikeStatus,
    newLikeStatus: LikeStatus,
  ) {
    if (oldLikeStatus === "Like" && newLikeStatus === "Dislike") {
      console.log("trigger"); //при постановке лайка на новую сущность лайка счетчик делает плюс один
      comment.likesCount--;
      comment.dislikesCount++;
      await this.commentsRepository.save(comment);
      return;
    }
    if (oldLikeStatus === "Like" && newLikeStatus === "None") {
      comment.likesCount--;
      await this.commentsRepository.save(comment);
      return;
    }
    if (oldLikeStatus === "Dislike" && newLikeStatus === "Like") {
      console.log("comment", comment);
      comment.likesCount++;
      comment.dislikesCount--;
      await this.commentsRepository.save(comment);
      return;
    }
    if (oldLikeStatus === "Dislike" && newLikeStatus === "None") {
      comment.dislikesCount--;
      await this.commentsRepository.save(comment);
      return;
    }
    if (oldLikeStatus === "None" && newLikeStatus === "Like") {
      console.log("trigger");
      comment.likesCount++;
      await this.commentsRepository.save(comment);
      return;
    }
    if (oldLikeStatus === "None" && newLikeStatus === "Dislike") {
      console.log("trigger");
      comment.dislikesCount++;
      await this.commentsRepository.save(comment);
      return;
    }
  }
}

//1 old L new D => L- D+
//5 old L new N => L-

//2 old D new L => L+ D-
//6 old D new N => D-

//3 old N new D => D+
//4 old N new L => L+

//1смотрим лайк и статус
//2 меняем в комменте count
//3 сохраняем коммент
