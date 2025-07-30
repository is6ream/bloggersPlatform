import { CommentViewModel } from "./../types/commentsTypes";
import { CommentsQueryInput } from "../types/input/comment-Query-Input";
import { commentsCollection } from "../../db/mongo.db";

export const commentsQueryRepository = {
  async findAll(
    queryDto: CommentsQueryInput,
  ): Promise<{ items: CommentViewModel[]; totalCount: number }> {
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

    const dbItems = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    const items = dbItems.map((item) => {
      return {
        id: item._id.toString(),
        content: item.content,
        commentatorInfo: {
          userId: item.commentatorInfo.userId,
          userLogin: item.commentatorInfo.userLogin,
        },
        createdAt: item.createdAt,
      };
    });
    return { items, totalCount };
  },
};
