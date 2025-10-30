import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { CommentDocument } from "../types/mongoose/mongoose";
import { CommentModel } from "../types/mongoose/mongoose";
import { CommentViewModel } from "../types/commentsTypes";

@injectable()
export class CommentsRepository {
  async create(comment: CommentDocument): Promise<string> {
    console.log(comment, "check comment in DAL");
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

  async getCommentDocument(id: string): Promise<CommentDocument | null> {
    const comment: CommentDocument | null = await CommentModel.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) return null;
    return comment;
  }

  async findById(id: string): Promise<CommentViewModel | null> {
    const comment = await CommentModel.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) return null;
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
