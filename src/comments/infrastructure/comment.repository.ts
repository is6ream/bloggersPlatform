import {
  CommentDB,
  CommentInputDto,
  CommentViewModel,
} from "../types/commentsTypes";
import { commentsCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { injectable } from "inversify";
import { CommentDocument } from "../types/mongoose/mongoose";

@injectable()
export class CommentsRepository {
  async create(comment: CommentDocument): Promise<string> {
    await comment.save();
    return comment._id.toString();
  }

  async update(comment: CommentDocument): Promise<boolean> {
    await comment.save();
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }

  async findByCommentId(id: string): Promise<WithId<CommentDB> | null> {
    return await commentsCollection.findOne({ _id: new ObjectId(id) });
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
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    };
  }
}
