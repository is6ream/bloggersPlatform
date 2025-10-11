import {
  CommentDB,
  CommentInputDto,
  CommentInputType,
  CommentViewModel,
} from "../types/commentsTypes";
import { commentsCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

export class CommentsRepository {
  async create(newComment: CommentInputType): Promise<string> {
    const insertResult = await commentsCollection.insertOne(newComment);
    return insertResult.insertedId.toString();
  }

  async update(id: string, dto: CommentInputDto): Promise<any> {
    const updateResult = await commentsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: dto,
      },
    );

    return updateResult.matchedCount === 1;
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
