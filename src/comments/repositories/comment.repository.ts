import { CommentInputDto, CommentInputType } from "../types/commentsTypes";
import { commentsCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";

export const commentsRepository = {
  async create(newComment: CommentInputType): Promise<string> {
    const insertResult = await commentsCollection.insertOne(newComment);
    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: CommentInputDto): Promise<void | null> {
    const updateResult = await commentsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          content: dto.content, //разобраться с этой ошибкой
        },
      }
    );
    if (updateResult.matchedCount < 1) {
      return null;
    }
    return;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
