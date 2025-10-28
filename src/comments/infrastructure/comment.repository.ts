import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { CommentDocument } from "../types/mongoose/mongoose";
import { CommentModel } from "../types/mongoose/mongoose";

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
    const deleteResult = await CommentModel.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
  async findById(id: string): Promise<CommentDocument | null> {
    const comment = await CommentModel.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) return null;
    return comment;
  }
}
