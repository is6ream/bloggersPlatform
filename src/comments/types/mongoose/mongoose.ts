import { CommentDB } from "../commentsTypes";
import { HydratedDocument, Model, Schema, model } from "mongoose";

export type CommentModel = Model<CommentDB>; //тип для описания модели из монгус для ветки комментов
export type CommentDocument = HydratedDocument<CommentDB>; //тип для описания возвращаемого документа из монгус со всеми полями

const commentsSchema = new Schema<CommentDB, CommentModel>({
  //схема для описания того, какие данные будут храниться в документе
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
