import {
  CommentDB,
  CommentInfoType,
  CommentInputDto,
  CommentInputType,
  CommentQueryOutput,
  CommentViewModel,
} from "../types/commentsTypes";
import { CommentsQueryInput } from "../types/input/comment-Query-Input";
import { ObjectId } from "mongodb";
import { WithId } from "mongodb";
import { injectable } from "inversify";
import { CommentModel } from "../types/mongoose/mongoose";
import { LikeModel } from "../likes/likesMongoose";

@injectable()
export class CommentsQueryRepository {
  async findAll(
    queryDto: CommentsQueryInput,
  ): Promise<{ items: WithId<CommentQueryOutput>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchContentTerm,
      searchDateTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchContentTerm || searchDateTerm) {
      filter.$or = [];
      if (searchContentTerm) {
        filter.$or.push({
          content: { $regex: searchContentTerm, $options: "i" },
        });
        if (searchDateTerm) {
          filter.$or.push({
            date: { $regex: searchDateTerm, $options: "i" },
          });
        }
      }
    }

    const items = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .lean();

    const totalCount = await CommentModel.countDocuments(filter);
    return { items, totalCount };
  }

  async findById(
    id: string,
    userId: string | undefined,
  ): Promise<CommentViewModel | null> {
    const comment = await CommentModel.findOne({ _id: new ObjectId(id) });
    const like = await LikeModel.findOne({
      commentId: new ObjectId(id),
      userId: userId,
    });
    if (!comment) {
      return null;
    }
    if (!like)
      return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: "None", //по дефолту установлено None
        },
      };
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId, //тут возвращается null, так быть не должно
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: like.status,
      },
    };
  }
  async findCommentByPostId(
    queryDto: CommentsQueryInput,
    userId: string | undefined,
    postId: string,
  ): Promise<{ items: CommentInputType[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchContentTerm } =
      queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = { postId };
    if (searchContentTerm) {
      filter.name = { $regex: searchContentTerm, $options: "i" };
    }
    const comments = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .lean();

    const items: CommentInputType[] = await Promise.all(
      comments.map(async (comment) => {
        const userLike = await LikeModel.findOne({
          commentId: comment._id,
          userId: userId,
        });
        return {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
          },
          createdAt: comment.createdAt,
          likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: userLike?.status || "None",
          },
        };
      }),
    );

    const totalCount = await CommentModel.countDocuments(filter);
    return { items, totalCount };
  }
}

//Создаем 6 комментариев
//ставим лайк первому комментарию первым и вторым пользователем
//ставим лайк второму комментарию вторым и третьим пользователем
//ставим дизлайк третьему комментарию первым пользователем
//ставим лайк четвертому комментарию первым, четвертым, вторым, третьим пользователем
//ставим лайк пятому комментарию вторым пользователем, ставим дизлайк третьим пользователем
//ставим лайк шестому комментарию первым пользователем, ставим дизлайк вторым пользователем

//И запрашиваем комментарии первым пользователем
