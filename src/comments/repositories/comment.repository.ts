import { CommentDBType, CommentInputType } from "../types/commentsTypes";
import { commentsCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

export const commentsRepository = {
  async create(newComment: CommentInputType): Promise<string> {
    const insertResult = await commentsCollection.insertOne(newComment);
    return insertResult.insertedId.toString();
  },
};
