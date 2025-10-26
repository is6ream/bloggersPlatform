import { CommentDB } from "../commentsTypes";
import { HydratedDocument, Model, Schema, model } from "mongoose";

export type CommentModel = Model<CommentDB>;
export type CommentDocument = HydratedDocument<CommentDB>;
const commentsSchema = new Schema<CommentDB, CommentModel>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now(), required: true },
});

export const CommentModel = model<CommentDB, CommentModel>(
  "commentModel",
  commentsSchema,
);
