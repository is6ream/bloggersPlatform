import {
  CommentDB,
  CommentQueryOtput,
  CommentViewModel,
} from "../types/commentsTypes";
import { CommentsQueryInput } from "../types/input/comment-Query-Input";
import { commentsCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";
import { WithId } from "mongodb";

class CommentsQueryRepository {
  async findAll(
    queryDto: CommentsQueryInput,
  ): Promise<{ items: WithId<CommentQueryOtput>[]; totalCount: number }> {
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

    const items = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);
    return { items, totalCount };
  }

  async findById(id: string): Promise<CommentViewModel | null> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });
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

    const items = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    return { items, totalCount };
  }
}
export const commentsQueryRepository = new CommentsQueryRepository();
