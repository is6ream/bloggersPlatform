import {
  CommentDB,
  CommentQueryOutput,
  CommentViewModel,
} from "../types/commentsTypes";
import { CommentsQueryInput } from "../types/input/comment-Query-Input";
import { ObjectId } from "mongodb";
import { WithId } from "mongodb";
import { injectable } from "inversify";
import {CommentDocument, CommentModel} from "../types/mongoose/mongoose";
import {LikeModel} from "../likes/likesMongoose";

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

  async findById(id: string): Promise<CommentViewModel | null> {
    const comment = await CommentModel.findOne({ _id: new ObjectId(id) });
    const like = await LikeModel.findOne({ commentId: new ObjectId(id) }); //если лайка нет,
      //в каком формате мы должны отдать данные?
    if (!comment) {
      return null;
    }
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId, //тут возвращается null, так быть не должно
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: like.status,
      },
    };
  }

  async findCommentByPostId(
    queryDto: CommentsQueryInput,
    postId: string,
  ): Promise<{ items: WithId<CommentDB>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchContentTerm } =
      queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {
      postId,
    };

    if (searchContentTerm) {
      filter.name = { $regex: searchContentTerm, $options: "i" };
    }

    const items = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .lean();

    const totalCount = await CommentModel.countDocuments(filter);

    return { items, totalCount };
  }
}
