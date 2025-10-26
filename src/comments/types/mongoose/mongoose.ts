import { CommentDB } from "../commentsTypes";
import { HydratedDocument, Model, Schema } from "mongoose";

export type CommentModel = Model<CommentDB>;
export type CommentDocument = HydratedDocument<CommentDB>;
export type CommentInfoType = {
  userId: { type: String; required: true };
  userLogin: { type: String; required: true };
};
const commentsSchema = new Schema<CommentDB, CommentModel>({
  content: { type: String, required: true },
  commentatorInfo: { type: CommentInfoType },
});
