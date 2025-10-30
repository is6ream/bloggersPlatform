import { CommentDB } from "../commentsTypes";
import { HydratedDocument, Model, Schema, model } from "mongoose";
import { type } from "node:os";

export type CommentModel = Model<CommentDB>; //тип для описания модели из монгус для ветки комментов
export type CommentDocument = HydratedDocument<CommentDB>; //тип для описания возвращаемого документа из монгус со всеми полями

const commentsSchema = new Schema<CommentDB, CommentModel>(
  {
    //схема для описания того, какие данные будут храниться в документе
    content: { type: String, required: true },
    commentatorInfo: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now(), required: true },
  },
  {
    versionKey: false,
  },
);

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export type LikesDbType = {
  status: LikeStatus;
  userId: string;
  commentId: string;
  createdAt: Date;
};
export type LikeModel = Model<LikesDbType>;
export type LikeDocument = HydratedDocument<LikesDbType>;
const likesSchema = new Schema<LikesDbType, LikeModel>({
  status: { type: String, required: true }, //изначально статус у нас должен быть None?
  userId: { type: String, required: true },
  commentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), required: true },
});

export const CommentModel = model<CommentDB, CommentModel>(
  "commentModel",
  commentsSchema,
);
